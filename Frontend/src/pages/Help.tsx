import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Video,
  Users,
  Zap,
  Send,
  X,
  Bot
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started']));
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [emailForm, setEmailForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [selectedChatQuestion, setSelectedChatQuestion] = useState('');
  
  const predefinedQuestions = [
    'How do I upload a movie transcript?',
    'What file formats are supported?',
    'How accurate is the AI analysis?',
    'How do I change my password?',
    'Why is my analysis taking so long?',
    'How do I update my profile picture?'
  ];
  
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Email sending logic would go here
    console.log('Sending email to tagzilla05@gmail.com:', emailForm);
    // Reset form
    setEmailForm({ name: '', email: '', subject: '', message: '' });
    setShowEmailForm(false);
    alert('Your message has been sent to our support team!');
  };
  
  const handleChatQuestionSelect = (question: string) => {
    setSelectedChatQuestion(question);
    // Find the answer from FAQ data
    const answer = faqData.flatMap(section => section.items)
      .find(item => item.question === question)?.answer || 'Thank you for your question! Our support team will get back to you shortly.';
    setTimeout(() => {
      alert(`Tagzilla Bot: ${answer}`);
    }, 500);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const faqData = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      items: [
        {
          question: 'How do I upload a movie transcript?',
          answer: 'Navigate to the Predictions page and use the file upload feature. You can drag and drop TXT files or click to browse. The system supports various transcript formats.'
        },
        {
          question: 'What file formats are supported?',
          answer: 'Currently, we support TXT, DOC, and PDF files. For best results, use plain text files with clear dialogue formatting.'
        },
        {
          question: 'How long does analysis take?',
          answer: 'Analysis typically takes 2-5 minutes depending on transcript length. You\'ll receive real-time updates on the progress.'
        }
      ]
    },
    {
      id: 'ai-features',
      title: 'AI Features',
      icon: Zap,
      items: [
        {
          question: 'What metadata does the AI extract?',
          answer: 'Our AI extracts key themes, named entities (people, organizations, locations), sentiment analysis, speaker identification, and content classification.'
        },
        {
          question: 'How accurate is the AI analysis?',
          answer: 'Our AI models achieve 85-92% accuracy on standard movie transcripts. Accuracy may vary based on transcript quality and formatting.'
        },
        {
          question: 'Can I customize the AI analysis?',
          answer: 'Yes, you can adjust analysis parameters in the settings to focus on specific aspects like sentiment, entities, or themes.'
        }
      ]
    },
    {
      id: 'account-management',
      title: 'Account Management',
      icon: Users,
      items: [
        {
          question: 'How do I change my password?',
          answer: 'Go to Settings > Security and use the password change form. You\'ll need to provide your current password for verification.'
        },
        {
          question: 'Can I use multiple accounts?',
          answer: 'Yes, you can switch between multiple accounts using the account switcher in your profile dropdown menu.'
        },
        {
          question: 'How do I update my profile picture?',
          answer: 'Click on your profile picture in the header, then select "Upload Photo" to change your profile image.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: FileText,
      items: [
        {
          question: 'Why is my analysis taking so long?',
          answer: 'Large transcripts or complex formatting can increase processing time. Check your transcript format and try breaking it into smaller sections if needed.'
        },
        {
          question: 'The AI isn\'t recognizing speakers correctly',
          answer: 'Ensure your transcript has clear speaker labels (e.g., "JOHN:", "MARY:"). The AI works best with consistent formatting.'
        },
        {
          question: 'I\'m getting an error during upload',
          answer: 'Check your file size (max 50MB) and format. If issues persist, try converting your file to plain text format.'
        }
      ]
    }
  ];

  const filteredFAQ = faqData.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions, learn how to use Tagzilla effectively, and get support when you need it.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowChatbot(true)}>
            <MessageCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Get instant help from our support chatbot</p>
            <Button className="w-full">Start Chat</Button>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowEmailForm(true)}>
            <Mail className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us a detailed message</p>
            <Button variant="outline" className="w-full">Send Email</Button>
          </Card>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {filteredFAQ.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <Card key={section.id} className="overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-6 space-y-6">
                      {section.items.map((item, index) => (
                        <div key={index} className="border-l-4 border-primary-200 pl-4">
                          <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card>
            );
          })}
        </div>

    

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">Still Need Help?</h2>
              <p className="text-primary-700 mb-6">
                Our support team is here to help you get the most out of Tagzilla.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary-600 hover:bg-primary-700" onClick={() => setShowChatbot(true)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Live Chat
                </Button>
                <Button variant="outline" className="border-primary-300 text-primary-700 hover:bg-primary-50" onClick={() => setShowEmailForm(true)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Email Form Modal */}
        {showEmailForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleEmailSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={emailForm.name}
                      onChange={(e) => setEmailForm({...emailForm, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={emailForm.message}
                      onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Please describe your issue or question in detail"
                    ></textarea>
                  </div>
                  <div className="text-xs text-gray-500">
                    Your message will be sent to: tagzilla05@gmail.com
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowEmailForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Chatbot Modal */}
        {showChatbot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Tagzilla Support Bot</h3>
                </div>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Hi! I'm here to help. Please select a question from the list below:
                </p>
                {predefinedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleChatQuestionSelect(question)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  >
                    {question}
                  </button>
                ))}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    For complex issues, please use our email support for detailed assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 border-t border-gray-200 pt-8">
          <p>© 2025 Tagzilla. All rights reserved. AI-Powered Movie Metadata Tagging Platform.</p>
          <p className="mt-2 text-sm">
            Need immediate assistance? Email us at tagzilla05@gmail.com
          </p>
        </footer>
      </motion.div>
    </div>
  );
};

export default Help;
