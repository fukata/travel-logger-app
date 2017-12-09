#!/usr/bin/env ruby
require 'bundler'
Bundler.require

require 'yaml'
require 'active_support'
require 'active_support/core_ext'

Geocoder.configure(units: :km)

def init_logger(opt)
  if opt.dig(:config, :log_dir).blank?
    $logger = Logger.new(STDOUT)
  else
    $logger = Logger.new("#{opt[:config][:log_dir]}/map.log")
  end
end

def logger
  $logger
end

def parse_options
  options = {}
  OptionParser.new do |opt|
    opt.on('--config PATH', '/path/to/config') {|v| options[:config] = v }
    opt.on('--location PATH', '/path/to/location_file') {|v| options[:location] = v }
    opt.on('--output PATH', '/path/to/output') {|v| options[:output] = v }
    opt.on('--without-remove-abnormal-log', 'not remove abnormal location logs') { options[:without_remove_abnormal_log] = true }
    opt.parse!(ARGV)
  end
  options[:config] = 'config.local.yml' if options[:config].blank? && File.exist?('config.local.yml')
  if options[:config]
    options[:config] = YAML.load_file(options[:config]).deep_symbolize_keys
  end
  options
end

def load_location_log_file(path, opt)
  location_logs = []
  File.foreach(path) {|line|
    line.strip!
    logger.debug line
    time_str, json_str = line.split("\t")
    time = Time.parse(time_str)
    dat = JSON.parse(json_str, symbolize_names: true)
    logger.debug "time=#{time}, dat=#{dat}"
    location_logs.push({time: time, dat: dat})
  }
  location_logs
end

def remove_abnormal_location_logs(location_logs, opt)
  if opt[:without_remove_abnormal_log]
    logger.warn "NOT REMOVE ABNORMAL LOCATION LOGS"
    return location_logs
  end

  log_num = location_logs.length
  location_logs.each_with_index do |r, i|
    next if i == 0
    next if i == log_num - 1

    prev_loc = location_logs[i-1]
    curr_loc = r
    next_loc = location_logs[i+1]
    logger.debug("#{i}: curr_loc=#{curr_loc}, prev_loc=#{prev_loc}, next_loc=#{next_loc}")
    next if prev_loc[:abnormal] || curr_loc[:abnormal] || next_loc[:abnormal]

    distance1 = Geocoder::Calculations.distance_between([prev_loc[:dat][:latitude], prev_loc[:dat][:longitude]], [curr_loc[:dat][:latitude], curr_loc[:dat][:longitude]]) # prev => curr
    distance2 = Geocoder::Calculations.distance_between([curr_loc[:dat][:latitude], curr_loc[:dat][:longitude]], [next_loc[:dat][:latitude], next_loc[:dat][:longitude]]) # curr => next
    bearing1 = Geocoder::Calculations.bearing_between([prev_loc[:dat][:latitude], prev_loc[:dat][:longitude]], [curr_loc[:dat][:latitude], curr_loc[:dat][:longitude]]) # prev => curr
    bearing2 = Geocoder::Calculations.bearing_between([curr_loc[:dat][:latitude], curr_loc[:dat][:longitude]], [next_loc[:dat][:latitude], next_loc[:dat][:longitude]]) # curr => next

    abnormal = (bearing2 - bearing1).abs > 120
    curr_loc[:abnormal] = true
    logger.debug("#{i}: distance1=#{distance1}, distance2=#{distance2}, bearing1=#{bearing1}, bearing2=#{bearing2}, #{abnormal ? "abnormal" : ""}")
  end

  location_logs.reject{|r| r[:abnormal]}
end

# see http://www.refrec.jp/naiyo/m6/m6_sub22.html
def parse_location_logs(location_logs, opt)
  results = {}

  location_logs = remove_abnormal_location_logs(location_logs, opt)

  locations = location_logs.map{|r| r[:dat]}
  results[:locations] = locations

  results
end

def render_erb(template_path, locals, opt)
  bind = binding
  locals.each do |k,v|
    bind.local_variable_set(k, v)
  end
  ERB.new(File.read(template_path), nil, '-').result(bind)
end

def main
  opt = parse_options()
  init_logger(opt)

  logger.info opt

  if opt[:location]
    location_logs = load_location_log_file(opt[:location], opt)
    parsed_data = parse_location_logs(location_logs, opt)
    html = render_erb('map.html.erb', parsed_data, opt)
    if opt[:output]
      File.write(opt[:output], html)
    else
      logger.debug html
    end
  end
end

main
