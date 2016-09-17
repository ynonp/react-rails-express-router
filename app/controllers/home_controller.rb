class HomeController < ApplicationController
  layout 'application'
  respond_to :html, :json

  def index
    @appstate = {
      msg: "hello world. Server time is: #{Time.zone.now.strftime('%s')}"
    }
    render_appstate
  end
end
