class Admin::CompaniesController < ApplicationController

  respond_to :html

  def index
    @companies = Company.all
    respond_with(:admin, @companies)
  end

  def new
    @company = Company.new
    respond_with(:admin, @company)
  end

  def edit
    @company = Company.find(params[:id])
    respond_with(:admin, @company)
  end

  def create
    @company = Company.new(params[:company])
    flash[:notice] = "Company created!" if @company.save

    respond_with(:admin, @company, :location => admin_companies_path)
  end

  def update
    @company = Company.find(params[:id])
    flash[:notice] = "Company Updated!" if @company.update_attributes(params[:company])

    respond_with(:admin, @company, :location => admin_companies_path)
  end

  def destroy
    @company = Company.find(params[:id])
    @company.destroy

    respond_with(:admin, @company)
  end

  # /companies/1/logo
  def logo
    @company = Company.find(params[:id])
    @image = @company.logo_data
    send_data(@image, :type => @company.logo_content_type, :disposition => 'inline')
  end

  # /companies/1/icon
  def icon
    @company = Company.find(params[:id])
    @image = @company.icon_data
    send_data(@image, :type => @company.icon_content_type, :disposition => 'inline')
  end


end
