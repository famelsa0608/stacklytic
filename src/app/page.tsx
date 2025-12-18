"use client" // <-- Bu satırı eklemek hatayı çözer

import dynamic from 'next/dynamic'

// Calculator bileşenini güvenli bir şekilde yüklüyoruz
const Calculator = dynamic(() => import('./components/Calculator'), { 
  ssr: false 
})

export default function Page() {
  return (
    <main>
      <Calculator />
    </main>
  )
}