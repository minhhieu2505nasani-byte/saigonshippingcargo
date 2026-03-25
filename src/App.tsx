import React, { useState } from 'react';
import { 
  Layout, 
  BookOpen, 
  ShoppingBag, 
  Package, 
  Code, 
  ChevronRight, 
  Copy, 
  Check,
  Search,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
type ApiSection = 'overview' | 'buy-list' | 'buy-create' | 'consignment-list' | 'consignment-create';

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ResponseField {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  isHeader?: boolean;
}

interface EndpointProps {
  method: 'GET' | 'POST';
  path: string;
  title: string;
  description: string;
  params?: Parameter[];
  body?: any;
  response?: any;
  responseFields?: ResponseField[];
  children?: React.ReactNode;
}

const CodeBlock = ({ code, language = 'javascript' }: { code: string, language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-slate-950 border border-slate-800 my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{language}</span>
        <button 
          onClick={handleCopy}
          className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const ApiEndpoint = ({ method, path, title, description, params, body, response, responseFields, children }: EndpointProps) => {
  return (
    <div className="mb-12">
      <h3 className="text-2xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6 max-w-3xl">{description}</p>

      {children}
      
      <div className="flex items-center gap-3 mb-6 font-mono text-sm">
        <span className={`px-3 py-1 rounded font-bold ${
          method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
        }`}>
          {method}
        </span>
        <span className="text-slate-500">{path}</span>
      </div>

      {params && params.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Query Parameters</h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Parameter</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Type</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Required</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {params.map((p) => (
                  <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-blue-600">{p.name}</td>
                    <td className="px-4 py-3 text-slate-500">{p.type}</td>
                    <td className="px-4 py-3">
                      {p.required ? (
                        <span className="text-red-500 font-medium">Yes</span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {body && (
        <div className="mb-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Request Body</h4>
          <CodeBlock code={JSON.stringify(body, null, 2)} language="json" />
        </div>
      )}

      {responseFields && responseFields.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Dữ liệu trả về (Response Fields)</h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Trường (Field)</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Bắt buộc</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Mô tả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {responseFields.map((f, idx) => (
                  <tr key={idx} className={`${f.isHeader ? 'bg-slate-50 font-bold' : 'hover:bg-slate-50'} transition-colors`}>
                    <td className={`px-4 py-3 font-mono ${f.isHeader ? 'text-slate-900' : 'text-blue-600'}`}>
                      {f.name}
                    </td>
                    <td className="px-4 py-3">
                      {f.isHeader ? '' : f.required ? (
                        <span className="text-red-500 font-medium">yes</span>
                      ) : (
                        <span className="text-slate-400">no</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="text-slate-400 mr-2">{f.isHeader ? '' : f.type + ' -'}</span>
                      {f.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {response && (
        <div className="mb-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Response Example</h4>
          <CodeBlock code={JSON.stringify(response, null, 2)} language="json" />
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState<ApiSection>('overview');

  const navItems = [
    { id: 'overview', label: 'Tổng quan', icon: BookOpen },
    { id: 'buy-list', label: 'Danh sách mua hộ', icon: Search, group: 'API Mua Hộ' },
    { id: 'buy-create', label: 'Đăng đơn mua hộ', icon: PlusCircle, group: 'API Mua Hộ' },
    // { id: 'consignment-list', label: 'Danh sách ký gửi', icon: Package, group: 'API Ký Gửi' },
    { id: 'consignment-create', label: 'Đăng đơn ký gửi', icon: ArrowRight, group: 'API Ký Gửi' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl py-12"
          >
            <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
              Saigon Shipping <br />
              <span className="text-blue-600">Cổng Kết Nối API Đối Tác</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              Nền tảng API hiện đại giúp đối tác tự động hóa quy trình mua hộ và ký gửi hàng hóa từ Mỹ về Việt Nam một cách nhanh chóng và chính xác.
            </p>
          </motion.div>
        );

      case 'buy-list':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ApiEndpoint 
              method="GET"
              path="/buy-requests"
              title="Lấy danh sách mua hộ"
              description="Truy xuất danh sách các yêu cầu mua hộ của bạn với các tùy chọn lọc mạnh mẽ."
              response={{
                success: true,
                data: [
                  {
                    "order_id": "SGS_YCBG_K90AH4UM1562",
                    "email": "caomyai@gmail.com",
                    "current_status": "Customer Approved",
                    "is_purchased": 1,
                    "is_in_warehouse": 0,
                    "is_cancelled": 0,
                    "shipping_information": {
                      "confirmation_date": "21-03-2026 12:04",
                      "sender": {
                        "full_name": "SAIGON SHIPPING CARGO",
                        "phone": "408 868 2222",
                        "email": "tdfutureofficial@gmail.com",
                        "address": "1199 E Calaveras Blvd, Milpitas 95035"
                      },
                      "recipient": {
                        "full_name": "Anh Thong (Nguyen Thanh)",
                        "phone": "0916426058",
                        "email": "caomyai@gmail.com",
                        "address": "10th Floor, South Building, Jesco Co., No. 60 Truong Son Street, Ward 2, Tan Binh District, HCMC"
                      }
                    },
                    "products": [
                      {
                        "product_name": "1308590 - Nature Made E",
                        "price_usd": 12.99,
                        "quantity": 1,
                        "supplier": "Costco",
                        "markup_percentage": 5,
                        "costs": {
                          "domestic_shipping_usd": 0,
                          "tax_usd": 10,
                          "surcharge_usd": 0,
                          "weight_lbs": 1.3,
                          "exchange_rate": 27500,
                          "air_freight_usd": 2.8
                        },
                        "total_amount_usd": 18.58,
                        "total_amount_vnd": 511000
                      },
                      {
                        "product_name": "1223025 - L'il Critters Gummy",
                        "price_usd": 9.49,
                        "quantity": 1,
                        "supplier": "Costco",
                        "markup_percentage": 5,
                        "costs": {
                          "domestic_shipping_usd": 0,
                          "tax_usd": 10,
                          "surcharge_usd": 0,
                          "weight_lbs": 1.8,
                          "exchange_rate": 27500,
                          "air_freight_usd": 2.8
                        },
                        "total_amount_usd": 15.95,
                        "total_amount_vnd": 439000
                      }
                    ],
                    "summary": {
                      "total_usd": 53.92,
                      "total_vnd": 1483000,
                      "payment_status": "Unpaid"
                    }
                  }
                ]
              }}
            />
          </motion.div>
        );

      case 'buy-create':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ApiEndpoint 
              method="POST"
              path="/buy-requests"
              title="Đăng đơn mua hộ"
              description="Tạo một yêu cầu mua hộ mới. Bạn cần cung cấp link sản phẩm và các thông tin chi tiết liên quan."
              body={{
                "order_id": "SGS_YCBG_K90AH4UM1562",
                "email": "caomyai@gmail.com",
                "shipping_information": {
                  "sender": {
                    "full_name": "SAIGON SHIPPING CARGO",
                    "phone": "408 868 2222",
                    "email": "tdfutureofficial@gmail.com",
                    "address": "1199 E Calaveras Blvd, Milpitas 95035"
                  },
                  "recipient": {
                    "full_name": "Anh Thong (Nguyen Thanh)",
                    "phone": "0916426058",
                    "email": "caomyai@gmail.com",
                    "address": "10th Floor, South Building, Jesco Co., No. 60 Truong Son Street, Ward 2, Tan Binh District, HCMC"
                  }
                },
                "products": [
                  {
                    "product_name": "1308590 - Nature Made E",
                    "price_usd": 12.99,
                    "quantity": 1,
                    "supplier": "Costco",
                    "markup_percentage": 5,
                    "costs": {
                      "domestic_shipping_usd": 0,
                      "tax_usd": 10,
                      "surcharge_usd": 0,
                      "weight_lbs": 1.3,
                      "exchange_rate": 27500,
                      "air_freight_usd": 2.8
                    }
                  },
                  {
                    "product_name": "1223025 - L'il Critters Gummy",
                    "price_usd": 9.49,
                    "quantity": 1,
                    "supplier": "Costco",
                    "markup_percentage": 5,
                    "costs": {
                      "domestic_shipping_usd": 0,
                      "tax_usd": 10,
                      "surcharge_usd": 0,
                      "weight_lbs": 1.8,
                      "exchange_rate": 27500,
                      "air_freight_usd": 2.8
                    }
                  }
                ]
              }}
              response={{
                success: true,
                message: "Tạo đơn mua hộ thành công",
                data: {
                  order_id: "SGS_YCBG_K90AH4UM1562",
                  order_code: "BUY-67890",
                  status: "cho-duyet",
                  created_at: "2024-03-24T03:58:56Z"
                }
              }}
            >
              <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                    <BookOpen size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Mô tả tích hợp</h3>
                </div>
                <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
                  <p>
                    Để đảm bảo tính nhất quán và khả năng truy vết dữ liệu giữa hai hệ thống, quy trình xử lý mã đơn hàng được quy định như sau:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      <span className="font-semibold text-slate-900">Mã đơn hàng đối tác (order_id):</span> Phía đối tác gửi lên cho chúng tôi trường <code className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-700 font-mono text-xs">order_id</code>.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Lưu trữ đối soát (id_partner):</span> Chúng tôi sẽ lưu lại giá trị này trong hệ thống với tên trường là <code className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-700 font-mono text-xs">id_partner</code> để phục vụ đối soát và truy vết sau này.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Mã đơn hàng nội bộ (order_code):</span> Đồng thời, hệ thống của chúng tôi sẽ tự động sinh ra một mã đơn hàng nội bộ (<code className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-700 font-mono text-xs">order_code</code>) riêng để quản lý trong hệ thống.
                    </li>
                  </ul>
                </div>
              </div>
            </ApiEndpoint>
          </motion.div>
        );

      case 'consignment-list':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ApiEndpoint 
              method="GET"
              path="/consignment-requests"
              title="Lấy danh sách ký gửi"
              description="Xem tất cả các đơn hàng ký gửi của bạn và theo dõi hành trình của chúng."
              params={[
                { name: 'order_id', type: 'string', required: false, description: 'Mã đơn ký gửi' },
                { name: 'email', type: 'string', required: false, description: 'Email khách hàng' },
                { name: 'tracking_number', type: 'string', required: false, description: 'Mã vận đơn nội địa' },
                { name: 'status', type: 'string', required: false, description: 'Trạng thái (đã nhận kho, đang về...)' },
                { name: 'from_date', type: 'string (ISO)', required: false, description: 'Ngày bắt đầu lọc (YYYY-MM-DD)' },
                { name: 'to_date', type: 'string (ISO)', required: false, description: 'Ngày kết thúc lọc (YYYY-MM-DD)' },
                { name: 'page', type: 'number', required: false, description: 'Trang hiện tại (mặc định: 1)' },
                { name: 'limit', type: 'number', required: false, description: 'Số lượng bản ghi trên mỗi trang (mặc định: 20)' },
              ]}
              response={{
                success: true,
                data: [
                  {
                    id: "CON-999",
                    tracking_number: "TRACK123456",
                    weight: 2.5,
                    status: "đang về",
                    updated_at: "2024-03-22T15:30:00Z"
                  }
                ]
              }}
            />
          </motion.div>
        );

      case 'consignment-create':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ApiEndpoint 
              method="POST"
              path="/consignment-requests"
              title="Đăng đơn ký gửi"
              description="Đăng ký mã vận đơn ký gửi để chúng tôi có thể nhận và xử lý hàng hóa của bạn tại kho."
              body={{
                "consignment_id": "SGS_KG_K90AH4UM1562",
                "consignment": [
                  {
                    "code_tracking": "TK_HAGSY",
                    "goods_declaration": "San pham 1,San pham 2"
                  },
                  {
                    "code_tracking": "TK_KA72J",
                    "goods_declaration": "San pham 3,San pham 4"
                  }
                ],
                "shipping_information": {
                  "sender": {
                    "full_name": "SAIGON SHIPPING CARGO",
                    "phone": "408 868 2222",
                    "email": "tdfutureofficial@gmail.com",
                    "address": "1199 E Calaveras Blvd, Milpitas 95035"
                  },
                  "recipient": {
                    "full_name": "Anh Thong (Nguyen Thanh)",
                    "phone": "0916426058",
                    "email": "caomyai@gmail.com",
                    "address": "10th Floor, South Building, Jesco Co., No. 60 Truong Son Street, Ward 2, Tan Binh District, HCMC"
                  }
                }
              }}
              response={{
                success: true,
                message: "Tạo đơn ký gửi thành công",
                data: {
                  "consignment_id": "SGS_YCBG_K90AH4UM1562",
                  "consignment_code": "BUY-67890",
                  "status": "dang-xu-ly"
                }
              }}
            >
              <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                    <BookOpen size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Mô tả tích hợp</h3>
                </div>
                <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
                  <p>
                    Để đảm bảo tính nhất quán và khả năng truy vết dữ liệu giữa hai hệ thống, quy trình xử lý mã đơn hàng ký gửi được quy định như sau:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      <span className="font-semibold text-slate-900">Mã ký gửi đối tác (consignment_id):</span> Phía đối tác gửi lên cho chúng tôi trường <code className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-700 font-mono text-xs">consignment_id</code>.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Lưu trữ đối soát (id_partner):</span> Chúng tôi sẽ lưu lại giá trị này trong hệ thống với tên trường là <code className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-700 font-mono text-xs">id_partner</code> để phục vụ đối soát và truy vết sau này.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Mã ký gửi nội bộ (consignment_code):</span> Đồng thời, hệ thống của chúng tôi sẽ tự động sinh ra một mã ký gửi nội bộ (<code className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-700 font-mono text-xs">consignment_code</code>) riêng để quản lý trong hệ thống.
                    </li>
                  </ul>
                </div>
              </div>
            </ApiEndpoint>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="https://saigonshippingcargo.com/thumbs/210x60x2/upload/photo/logo-saigon-shipping-2445.png" 
              alt="Saigon Shipping Logo" 
              className="h-8 w-auto"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">API Documentation</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8">
          {/* Grouping logic */}
          {['', 'API Mua Hộ', 'API Ký Gửi'].map(group => {
            const items = navItems.filter(item => (item.group || '') === group);
            if (items.length === 0) return null;

            return (
              <div key={group || 'main'}>
                {group && <h4 className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{group}</h4>}
                <div className="space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as ApiSection)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <item.icon size={18} className={activeSection === item.id ? 'text-blue-600' : 'text-slate-400'} />
                      {item.label}
                      {activeSection === item.id && (
                        <motion.div layoutId="active-pill" className="ml-auto">
                          <ChevronRight size={14} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Docs</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">
              {navItems.find(n => n.id === activeSection)?.label}
            </span>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-8 py-12">
          <AnimatePresence mode="wait">
            <div key={activeSection}>
              {renderContent()}
            </div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="max-w-5xl mx-auto px-8 py-12 border-t border-slate-200 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-400">© 2024 Saigon Shipping Cargo. All rights reserved.</p>
            <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-slate-900">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900">Terms of Service</a>
              <a href="#" className="hover:text-slate-900">Status Page</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
