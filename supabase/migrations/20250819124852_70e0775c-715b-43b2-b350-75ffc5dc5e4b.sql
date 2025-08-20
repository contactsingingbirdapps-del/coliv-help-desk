-- Create issues table
CREATE TABLE public.issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved')),
  submitted_by TEXT NOT NULL,
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a community issue tracker)
CREATE POLICY "Anyone can view issues" 
ON public.issues 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create issues" 
ON public.issues 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update issues" 
ON public.issues 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_issues_updated_at
BEFORE UPDATE ON public.issues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_issues_priority ON public.issues(priority);
CREATE INDEX idx_issues_category ON public.issues(category);
CREATE INDEX idx_issues_created_at ON public.issues(created_at DESC);

