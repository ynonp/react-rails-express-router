class HomeController < ApplicationController
  layout 'application'

  def index
    @appstate = {
      msg: "hello world. Server time is: #{Time.zone.now.strftime('%s')}"
    }
    render_appstate
  end
end
