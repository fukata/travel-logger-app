#!/usr/bin/env ruby
require 'bundler'
Bundler.require

require 'yaml'
require 'active_support'
require 'active_support/core_ext'

def parse_options
  options = {}
  OptionParser.new do |opt|
    opt.on('--config PATH', '/path/to/config') {|v| options[:config] = v }
    opt.on('--location PATH', '/path/to/location_file') {|v| options[:location] = v }
    opt.on('--output PATH', '/path/to/output') {|v| options[:output] = v }
    opt.parse!(ARGV)
  end
  if options[:config]
    options[:config] = YAML.load_file(options[:config]).deep_symbolize_keys
  end
  options
end

def parse_location_log_file(path, opt)
  location_logs = []
  File.foreach(path) {|line|
    puts line
    time_str, json_str = line.split("\t")
    time = Time.parse(time_str)
    dat = JSON.parse(json_str, symbolize_names: true)
    puts "time=#{time}, dat=#{dat}"
    location_logs.push({time: time, dat: dat})
  }
  location_logs
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
  puts opt

  if opt[:location]
    location_logs = parse_location_log_file(opt[:location], opt)
    locations = location_logs.map{|r| r[:dat]}
    html = render_erb('map.html.erb', {locations: locations}, opt)
    if opt[:output]
      File.write(opt[:output], html)
    else
      puts html
    end
  end
end

main
