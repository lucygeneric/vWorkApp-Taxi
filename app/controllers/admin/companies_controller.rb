class Admin::CompaniesController < ApplicationController
  # GET /companies
  # GET /companies.json
  def index
    @companies = Company.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @companies }
    end
  end

  # GET /companies/new
  # GET /companies/new.json
  def new
    @company = Company.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render :json => @company }
    end
  end

  # GET /companies/1/edit
  def edit
    @company = Company.find(params[:id])
  end

  # POST /companies
  # POST /companies.json
  def create
    @company = Company.new(params[:company])
    upload_file(params[:logo], @company.logo_filename)

    respond_to do |format|
      if @company.save
        format.html { redirect_to [:admin, :companies], :notice => 'Company was successfully created.' }
        format.json { render :json => @company, :status => :created, :location => @company }
      else
        format.html { render :action => "new" }
        format.json { render :json => @company.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /companies/1
  # PUT /companies/1.json
  def update
    @company = Company.find(params[:id])
    upload_file(params[:logo], @company.logo_filename)

    respond_to do |format|
      if @company.update_attributes(params[:company])
        format.html { redirect_to [:admin, :companies], :notice => 'Company was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render :action => "edit" }
        format.json { render :json => @company.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /companies/1
  # DELETE /companies/1.json
  def destroy
    @company = Company.find(params[:id])
    @company.destroy

    respond_to do |format|
      format.html { redirect_to admin_companies_url }
      format.json { head :ok }
    end
  end

  def upload_file(io, name)
    return if io.nil?
    File.open(Rails.root.join('public', 'uploads', name), 'w') do |file|
      file.write(io.read)
    end
  end


end
