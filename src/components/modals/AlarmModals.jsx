import React, { useState } from 'react';

const AlarmModal = ({ market, currentPrice, onClose, onSubmit }) => {
    const [activeTab, setActiveTab] = useState('price');
    const [value, setValue] = useState('');

    // 모달 내부 클릭 시 이벤트 버블링 방지
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose} >

            <div className="bg-[#2B2B3F] rounded-xl p-6 w-[400px] shadow-lg" onClick={handleModalClick}>
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl text-white font-medium">알람 설정</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        닫기
                    </button>
                </div>

                {/* 탭 */}
                <div className="flex gap-2 mb-6">
                    <button
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'price'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#1E1E2D] text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setActiveTab('price')}
                    >
                        특정 가격
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'change'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#1E1E2D] text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setActiveTab('change')}
                    >
                        변동률
                    </button>
                </div>

                {/* 코인 정보 */}
                <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-lg text-white font-medium">{market.korean_name}</h3>
                        <span className="text-sm text-gray-400">{market.market}</span>
                    </div>
                    <p className="text-[#959CA8] text-sm font-light">
                        현재 가격: {currentPrice?.toLocaleString()} KRW
                    </p>
                </div>

                {/* 입력 영역 */}
                <div className="mb-6">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={activeTab === 'price' ? "가격을 입력하세요" : "변동률(%)을 입력하세요"}
                        className="w-full bg-[#1E1E2D] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* 등록 버튼 */}
                <button
                    onClick={() => onSubmit(activeTab, value)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium"
                >
                    등록
                </button>
            </div>
        </div>
    );
};

export default AlarmModal;