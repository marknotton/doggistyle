module DoggystyleSupport
  def install_doggystyle(path = nil)
    if path
      run_simple("bundle exec doggystyle install --path '#{path}'")
    else
      run_simple("bundle exec doggystyle install")
    end
  end

  def doggystyle_path(prefix, path)
    if prefix
      File.join(prefix, 'doggystyle', path)
    else
      File.join('doggystyle', path)
    end
  end
end

World(DoggystyleSupport)
