-- Create sales table to store webhook data
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  amount NUMERIC NOT NULL DEFAULT 0,
  customer_email TEXT,
  customer_name TEXT,
  product_name TEXT,
  payment_method TEXT,
  raw_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Only admins can view sales
CREATE POLICY "Only admins can view sales" 
ON public.sales 
FOR SELECT 
USING (is_admin());

-- Allow inserts from edge functions (no auth required for webhook)
CREATE POLICY "Allow webhook inserts" 
ON public.sales 
FOR INSERT 
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_sales_updated_at
BEFORE UPDATE ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();