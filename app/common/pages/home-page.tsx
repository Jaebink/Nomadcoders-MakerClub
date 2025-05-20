import { Button } from "../components/ui/button";
import { Form } from "react-router";
import { Card } from "../components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Textarea } from "../components/ui/textarea";

export default function HomePage() {
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-purple-900 mb-4">
                            비밀의 편지함
                        </h1>
                        <p className="text-lg text-gray-600">
                            당신의 고민을 익명의 편지로 전달하세요. 상대방에게는 이름 없이, 당신의 마음만 전해집니다.
                        </p>
                    </motion.div>

                    <Card className="p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-20"></div>
                        <Form onSubmit={handleSubmit} className="space-y-6 relative">
                            <div className="relative">
                                <motion.div 
                                    className="relative"
                                    whileHover={{ scale: 1.02 }}
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="relative">
                                        <Textarea 
                                            placeholder="예: 프로젝트 아이디어가 떠오르지 않아요..."
                                            className="w-full border-2 border-purple-300 focus:border-purple-500 rounded-lg p-4 h-48 resize-none"
                                            onFocus={() => setIsTyping(true)}
                                            onBlur={() => setIsTyping(false)}
                                        />
                                        {isTyping && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-gray-500 mt-2"
                                            >
                                                익명으로 전송됩니다. 신원이 노출되지 않습니다.
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                            <Button 
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 relative"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="relative z-10"
                                >
                                    {isSending ? (
                                        <>
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                                className="flex items-center gap-2"
                                            >
                                                <motion.div 
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                                                />
                                                <motion.span 
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    전송 중...
                                                </motion.span>
                                            </motion.div>
                                        </>
                                    ) : (
                                        <>
                                            <motion.span 
                                                whileHover={{ scale: 1.1 }}
                                                className="relative z-10"
                                            >
                                                편지 보내기
                                            </motion.span>
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg"
                                            />
                                        </>
                                    )}
                                </motion.div>
                            </Button>
                        </Form>
                    </Card>

                    {isSending && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-x-0 bottom-20 mx-auto w-64 text-center text-sm text-gray-600"
                        >
                            <motion.div 
                                animate={{ 
                                    x: [0, 20, 0],
                                    y: [0, -10, 0],
                                    rotate: [0, 10, 0]
                                }}
                                transition={{ 
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                className="inline-block"
                            >
                                📬
                            </motion.div>
                            <p className="mt-2 whitespace-nowrap">
                                당신의 비밀스러운 편지가 날아가고 있어요...
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}