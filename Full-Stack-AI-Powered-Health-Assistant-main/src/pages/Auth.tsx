import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, register, adminLogin, logout, user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description:
          error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        phone: phone || undefined,
      });
      toast({
        title: "Registration successful",
        description: "Welcome to Clarity Retina Care!",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description:
          error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await adminLogin(email, password);
      toast({
        title: "Admin login successful",
        description: "Welcome to the admin dashboard!",
      });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Admin login failed",
        description:
          error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to Clarity Retina Care
      </h1>
      {user ? (
        <Button onClick={handleLogout} className="mb-4">
          Log Out
        </Button>
      ) : (
        <Tabs defaultValue="login" className="max-w-xl">
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <AuthCard
              title="Login"
              onSubmit={handleLogin}
              loading={loading}
              fields={[
                {
                  name: "email",
                  type: "email",
                  label: "Email",
                  placeholder: "you@domain.com",
                  required: true,
                },
                {
                  name: "password",
                  type: "password",
                  label: "Password",
                  required: true,
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="signup">
            <AuthCard
              title="Create your account"
              onSubmit={handleSignup}
              loading={loading}
              fields={[
                {
                  name: "firstName",
                  type: "text",
                  label: "First Name",
                  required: true,
                },
                {
                  name: "lastName",
                  type: "text",
                  label: "Last Name",
                  required: true,
                },
                {
                  name: "email",
                  type: "email",
                  label: "Email",
                  placeholder: "you@domain.com",
                  required: true,
                },
                {
                  name: "phone",
                  type: "tel",
                  label: "Phone (optional)",
                  placeholder: "+1234567890",
                },
                {
                  name: "password",
                  type: "password",
                  label: "Password",
                  required: true,
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="admin">
            <AuthCard
              title="Admin Sign In"
              onSubmit={handleAdminLogin}
              loading={loading}
              fields={[
                {
                  name: "email",
                  type: "email",
                  label: "Admin Email",
                  placeholder: "admin@clarityretina.com",
                  required: true,
                },
                {
                  name: "password",
                  type: "password",
                  label: "Admin Password",
                  required: true,
                },
              ]}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

interface AuthField {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}

interface AuthCardProps {
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  fields: AuthField[];
}

function AuthCard({ title, onSubmit, loading, fields }: AuthCardProps) {
  return (
    <Card className="p-6 mt-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              disabled={loading}
              defaultValue={field.defaultValue}
            />
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Continue"}
        </Button>
      </form>
    </Card>
  );
}