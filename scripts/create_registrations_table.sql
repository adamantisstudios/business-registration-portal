-- Create a function to create the registrations table if it doesn't exist
CREATE OR REPLACE FUNCTION create_registrations_table()
RETURNS void AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'registrations'
  ) THEN
    -- Create the table
    CREATE TABLE public.registrations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      business_name TEXT NOT NULL,
      sector TEXT,
      other_sector TEXT,
      digital_address TEXT,
      house_number TEXT,
      street_name TEXT,
      city TEXT,
      district TEXT,
      region TEXT,
      ownership_type TEXT,
      landlord_name TEXT,
      same_address BOOLEAN DEFAULT FALSE,
      principal_digital_address TEXT,
      principal_house_number TEXT,
      principal_street_name TEXT,
      principal_city TEXT,
      principal_district TEXT,
      principal_region TEXT,
      postal_type TEXT,
      postal_number TEXT,
      postal_town TEXT,
      postal_region TEXT,
      phone_no1 TEXT,
      phone_no2 TEXT,
      mobile_no1 TEXT,
      mobile_no2 TEXT,
      fax TEXT,
      business_email TEXT,
      website TEXT,
      title TEXT,
      first_name TEXT,
      middle_name TEXT,
      last_name TEXT,
      former_name TEXT,
      gender TEXT,
      date_of_birth TEXT,
      nationality TEXT,
      occupation TEXT,
      tin TEXT,
      ghana_card_number TEXT,
      ghana_card_url TEXT,
      residential_digital_address TEXT,
      residential_house_number TEXT,
      residential_street_name TEXT,
      residential_city TEXT,
      residential_district TEXT,
      residential_region TEXT,
      country TEXT,
      revenue TEXT,
      employees TEXT,
      bop_request TEXT,
      bop_reference TEXT,
      applicant_name TEXT,
      signature_url TEXT,
      declaration_date TEXT,
      declaration BOOLEAN DEFAULT FALSE
    );
    
    -- Enable row level security
    ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for authenticated users
    CREATE POLICY "Allow authenticated users full access" 
      ON public.registrations 
      FOR ALL 
      TO authenticated 
      USING (true);
      
    -- Create policy for public read access
    CREATE POLICY "Allow public read access" 
      ON public.registrations 
      FOR SELECT 
      TO anon 
      USING (true);
  END IF;
END;
$$ LANGUAGE plpgsql;
