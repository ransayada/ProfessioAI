"use client";
import axios from "axios";
import * as z from "zod";
import AttentionFooter from "@/components/attention-footer";
import Heading from "@/components/heading";
import { Construction, GraduationCap } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import Empty from "@/components/empty";
import Loader from "@/components/loader";

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessage = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessage,
      });

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      //TODO: Open PRO Modal
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <>
      <div>
        <Heading
          title="Test Conversation"
          description="Test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test "
          icon={Construction}
          iconColor="text-indigo-500"
          bgColor="text-indigo-500/10"
        />
        <div className="px-4 lg:px-8">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="Test test test test test test test test "
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="col-span-12 lg:col-span-2 w-full"
                  disabled={isLoading}
                >
                  Generate
                </Button>
              </form>
            </Form>
          </div>
          <div className="space-y-4 mt-4">
            {true && (
              <div className="p-9 rounded-lg w-full flex items-center justify-center">
                <Loader />
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <Empty label="No Test Started" />
            )}
            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message) => (
                <div key={message.content}>{message.content}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AttentionFooter />
    </>
  );
};

export default ConversationPage;
