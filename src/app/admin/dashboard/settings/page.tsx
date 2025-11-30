'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ApiKey {
  id: string;
  value: string;
  provider: string;
  monthlyQuota: number;
  requestsUsed: number;
  status: 'active' | 'exhausted' | 'disabled';
}

const ApiKeySchema = z.object({
  value: z.string().min(1, 'API Key value is required.'),
  provider: z.string().min(1, 'Provider name is required.'),
  monthlyQuota: z.coerce.number().int().positive('Quota must be greater than 0.'),
});

type ApiKeyFormData = z.infer<typeof ApiKeySchema>;

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      value: 'gsk_...xyz',
      provider: 'Genkit',
      monthlyQuota: 1500,
      requestsUsed: 0,
      status: 'active',
    },
  ]);
  const { toast } = useToast();
  const form = useForm<ApiKeyFormData>({
    resolver: zodResolver(ApiKeySchema),
    defaultValues: {
      value: '',
      provider: '',
      monthlyQuota: 1000,
    },
  });

  const getStatusBadgeVariant = (
    status: ApiKey['status'],
    usage: number,
    quota: number
  ): 'default' | 'secondary' | 'destructive' => {
    const usagePercentage = (usage / quota) * 100;
    if (status === 'exhausted' || usagePercentage >= 100) return 'destructive';
    if (usagePercentage > 85) return 'secondary'; // Using secondary for yellow
    return 'default'; // Using default for green/active
  };
  
   const getStatusLabel = (
    status: ApiKey['status'],
    usage: number,
    quota: number
  ): string => {
    const usagePercentage = (usage / quota) * 100;
    if (status === 'exhausted' || usagePercentage >= 100) return 'Exhausted';
    if (usagePercentage > 85) return 'Almost Out';
    return 'Active';
  };

  const onSubmit: SubmitHandler<ApiKeyFormData> = (data) => {
    if (apiKeys.some((key) => key.value === data.value)) {
      form.setError('value', {
        type: 'manual',
        message: 'This API key value already exists.',
      });
      return;
    }

    const newKey: ApiKey = {
      id: (apiKeys.length + 1).toString(),
      value: data.value,
      provider: data.provider,
      monthlyQuota: data.monthlyQuota,
      requestsUsed: 0,
      status: 'active',
    };
    setApiKeys([...apiKeys, newKey]);
    toast({
      title: 'API Key Added',
      description: 'The new API key has been added successfully.',
    });
    form.reset();
    // Would need to find a way to programmatically close the dialog
    // For now, will rely on DialogClose button in the footer.
  };

  const handleDeleteKey = (id: string) => {
    if (apiKeys.length <= 1) {
      toast({
        variant: 'destructive',
        title: 'Cannot Delete Key',
        description: 'You must have at least one API key.',
      });
      return;
    }
    setApiKeys(apiKeys.filter((key) => key.id !== id));
    toast({
      title: 'API Key Deleted',
      description: 'The API key has been removed.',
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold font-headline">Settings</h1>
            <p className="text-muted-foreground">Manage your application settings.</p>
        </div>
         <Dialog onOpenChange={() => form.reset()}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" />
                Add New Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Add New API Key</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new API key.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key Value</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter API Key..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="provider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a provider" />
                                </SelectTrigger>
                               </FormControl>
                                <SelectContent>
                                    <SelectItem value="Genkit">Genkit</SelectItem>
                                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                                    <SelectItem value="Anthropic">Anthropic</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="monthlyQuota"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Quota</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 10000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Key</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
          <CardDescription>
            Add or remove your Genkit API keys. The system will automatically
            rotate keys if one becomes exhausted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Key (Masked)</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell>{apiKey.provider}</TableCell>
                  <TableCell className="font-mono">{`...${apiKey.value.slice(-4)}`}</TableCell>
                  <TableCell>
                    {apiKey.requestsUsed} / {apiKey.monthlyQuota}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(apiKey.status, apiKey.requestsUsed, apiKey.monthlyQuota)}>
                      {getStatusLabel(apiKey.status, apiKey.requestsUsed, apiKey.monthlyQuota)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
