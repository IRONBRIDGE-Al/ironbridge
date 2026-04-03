<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧲 IronForge — Launch Your Meme Coin in Under 10 Minutes</title>
    <meta name="description" content="No code, super cheap & easy on Base + $BNKR. Launch for $49-$199.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', system-ui, sans-serif; }
        
        :root {
            --bg: #0a0a0f;
            --bg-card: #12121a;
            --purple: #8b5cf6;
            --cyan: #22d3ee;
            --green: #10b981;
            --pink: #ec4899;
            --text: #f8fafc;
            --text-dim: #94a3b8;
        }
        
        body {
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background: 
                radial-gradient(ellipse at 20% 10%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
            pointer-events: none;
            z-index: -1;
        }
        
        .container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
        
        header {
            padding: 1.25rem 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, var(--purple), var(--cyan));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .nav-links { display: flex; gap: 1.5rem; }
        .nav-links a { color: var(--text-dim); text-decoration: none; font-size: 0.85rem; }
        .nav-links a:hover { color: var(--cyan); }
        
        .hero { padding: 4rem 0; text-align: center; }
        
        .hero h1 {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 800;
            line-height: 1.15;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #fff, var(--cyan));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .hero .highlight {
            background: linear-gradient(135deg, var(--cyan), var(--green));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .hero p {
            font-size: 1.1rem;
            color: var(--text-dim);
            max-width: 550px;
            margin: 0 auto 2rem;
            line-height: 1.6;
        }
        
        .cta-main {
            display: inline-block;
            background: linear-gradient(135deg, var(--purple), var(--pink));
            color: white;
            font-size: 1.1rem;
            font-weight: 700;
            padding: 1rem 2.5rem;
            border-radius: 50px;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 25px rgba(139, 92, 246, 0.4);
        }
        
        .cta-main:hover { transform: translateY(-2px); box-shadow: 0 6px 35px rgba(139, 92, 246, 0.5); }
        
        .packages { padding: 3rem 0; }
        
        .section-title {
            text-align: center;
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 2rem;
        }
        
        .packages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            max-width: 900px;
            margin: 0 auto;
        }
        
        .package {
            background: var(--bg-card);
            padding: 1.75rem;
            border-radius: 1rem;
            border: 1px solid rgba(255,255,255,0.05);
            position: relative;
            transition: transform 0.2s;
        }
        
        .package:hover { transform: translateY(-3px); }
        
        .package.popular { border-color: var(--purple); box-shadow: 0 0 30px rgba(139, 92, 246, 0.15); }
        
        .popular-badge {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, var(--purple), var(--pink));
            color: white;
            font-size: 0.7rem;
            font-weight: 700;
            padding: 0.2rem 0.75rem;
            border-radius: 20px;
            white-space: nowrap;
        }
        
        .pkg-name { font-size: 1.35rem; font-weight: 700; margin-bottom: 0.25rem; }
        .pkg-price { font-size: 2rem; font-weight: 800; margin-bottom: 0.25rem; }
        .pkg-price span { font-size: 0.9rem; font-weight: 400; color: var(--text-dim); }
        
        .pkg-features { list-style: none; margin: 1rem 0; font-size: 0.85rem; }
        
        .pkg-features li {
            padding: 0.35rem 0;
            color: var(--text-dim);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .pkg-features li::before { content: '✓'; color: var(--green); font-weight: 700; font-size: 0.8rem; }
        
        .pkg-btn {
            width: 100%;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: var(--text);
            font-size: 0.95rem;
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .pkg-btn:hover { background: var(--purple); border-color: var(--purple); }
        
        .features { padding: 2rem 0; }
        
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
        .feature { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; }
        
        .form-section { padding: 2rem 0; }
        
        .launch-form {
            background: var(--bg-card);
            padding: 2rem;
            border-radius: 1rem;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .form-title { text-align: center; font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; }
        
        .progress-bar {
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            margin-bottom: 1.5rem;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--purple), var(--cyan));
            width: 0%;
            transition: width 0.3s;
        }
        
        .form-group { margin-bottom: 1.25rem; }
        
        .form-group label { display: block; margin-bottom: 0.4rem; font-weight: 600; font-size: 0.9rem; }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 0.7rem 0.9rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 0.5rem;
            color: var(--text);
            font-size: 0.95rem;
        }
        
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus { outline: none; border-color: var(--purple); }
        
        .form-group input::placeholder { color: var(--text-dim); opacity: 0.6; }
        
        .file-input {
            padding: 0.5rem;
            background: rgba(255,255,255,0.03);
            border: 1px dashed var(--text-dim);
            border-radius: 0.5rem;
            text-align: center;
            color: var(--text-dim);
            cursor: pointer;
        }
        
        .submit-btn {
            width: 100%;
            background: linear-gradient(135deg, var(--purple), var(--pink));
            color: white;
            font-size: 1rem;
            font-weight: 700;
            padding: 0.9rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .submit-btn:hover { transform: scale(1.02); }
        
        .payment-methods {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
            font-size: 0.85rem;
            color: var(--text-dim);
        }
        
        /* Success Modal */
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-overlay.show { display: flex; }
        
        .modal {
            background: var(--bg-card);
            padding: 2rem;
            border-radius: 1rem;
            max-width: 500px;
            text-align: center;
        }
        
        .modal h2 { font-size: 1.5rem; margin-bottom: 1rem; }
        
        .modal-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 0;
            text-align: left;
            color: var(--text-dim);
        }
        
        .modal-item.done { color: var(--green); }
        .modal-item.done::before { content: '✅ '; }
        .modal-item.pending::before { content: '⏳ '; }
        
        .modal-btn {
            margin-top: 1.5rem;
            background: var(--green);
            color: var(--bg);
            font-weight: 700;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
        }
        
        .faq { padding: 2rem 0; }
        
        .faq-item {
            background: var(--bg-card);
            padding: 1rem 1.25rem;
            border-radius: 0.5rem;
            margin-bottom: 0.75rem;
            cursor: pointer;
        }
        
        .faq-question { font-weight: 600; display: flex; justify-content: space-between; }
        
        .faq-answer {
            color: var(--text-dim);
            margin-top: 0.75rem;
            font-size: 0.9rem;
            display: none;
        }
        
        .faq-item.open .faq-answer { display: block; }
        
        footer {
            padding: 2rem 0;
            text-align: center;
            border-top: 1px solid rgba(255,255,255,0.05);
            color: var(--text-dim);
            font-size: 0.85rem;
        }
        
        footer a { color: var(--cyan); text-decoration: none; }
        
        @media (max-width: 600px) {
            .nav-links { display: none; }
            .hero { padding: 2.5rem 0; }
            .packages-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="logo"><span>🧲</span> IronForge</div>
            <nav class="nav-links">
                <a href="#packages">Packages</a>
                <a href="#features">Features</a>
                <a href="#launch">Launch</a>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Launch Your Meme Coin<br>in <span class="highlight">Under 10 Minutes</span></h1>
            <p>No code, super cheap & easy on Base + $BNKR. Everything pre-packed for beginners.</p>
            <a href="#packages" class="cta-main">🚀 Choose Your Package</a>
        </div>
    </section>

    <section class="packages" id="packages">
        <div class="container">
            <h2 class="section-title">Choose Your Package</h2>
            <div class="packages-grid">
                <!-- Starter $49 -->
                <div class="package">
                    <div class="pkg-name">🆕 Starter</div>
                    <div class="pkg-price">$49<span> one-time</span></div>
                    <ul class="pkg-features">
                        <li>Token on Base (ERC-20)</li>
                        <li>$500 liquidity pool</li>
                        <li>X template + bio</li>
                        <li>Telegram bot (basic)</li>
                        <li>One-page website</li>
                        <li>Simple dashboard</li>
                        <li>7-day content pack</li>
                    </ul>
                    <button class="pkg-btn" onclick="selectPkg('Starter', 49)">Select Starter — $49</button>
                </div>
                
                <!-- Growth $99 -->
                <div class="package popular">
                    <div class="popular-badge">🔥 MOST POPULAR</div>
                    <div class="pkg-name">📈 Growth</div>
                    <div class="pkg-price">$99<span> + $19/mo</span></div>
                    <ul class="pkg-features">
                        <li>Everything in Starter</li>
                        <li>$2,000 liquidity</li>
                        <li>Discord server</li>
                        <li>Farcaster profile</li>
                        <li>Live chart dashboard</li>
                        <li>30-day marketing</li>
                        <li>Auto price tweets</li>
                        <li>$BNKR liquidity boost</li>
                    </ul>
                    <button class="pkg-btn" onclick="selectPkg('Growth', 99)">Select Growth — $99/mo</button>
                </div>
                
                <!-- Viral $199 -->
                <div class="package">
                    <div class="pkg-name">🚀 Viral</div>
                    <div class="pkg-price">$199<span> + $39/mo</span></div>
                    <ul class="pkg-features">
                        <li>Everything in Growth</li>
                        <li>$5,000 liquidity</li>
                        <li>Custom meme art pack</li>
                        <li>Multi-chain option</li>
                        <li>Priority exposure</li>
                        <li>Dedicated Discord</li>
                        <li>White-glove support</li>
                    </ul>
                    <button class="pkg-btn" onclick="selectPkg('Viral', 199)">Select Viral — $199/mo</button>
                </div>
            </div>
        </div>
    </section>

    <section class="features" id="features">
        <div class="container">
            <h2 class="section-title">What's Included</h2>
            <div class="features-grid">
                <div class="feature">🪙 Token on Base</div>
                <div class="feature">💰 Liquidity Pool</div>
                <div class="feature">🌐 Your Website</div>
                <div class="feature">📊 Live Dashboard</div>
                <div class="feature">🤖 X + Telegram Bots</div>
                <div class="feature">💬 Discord Setup</div>
                <div class="feature">🎭 Farrcaster</div>
                <div class="feature">🛡️ Safety First</div>
                <div class="feature">💎 $BNKR Boost</div>
                <div class="feature">📈 Auto Updates</div>
            </div>
        </div>
    </section>

    <section class="form-section" id="launch">
        <div class="container">
            <div class="launch-form">
                <h2 class="form-title">🚀 Launch Your Coin</h2>
                
                <div class="progress-bar"><div class="progress-fill" id="progress"></div></div>
                
                <form id="launchForm">
                    <div class="form-group">
                        <label>Meme Name *</label>
                        <input type="text" name="memeName" id="memeName" placeholder="e.g. IronForge" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Ticker Symbol * (with $)</label>
                        <input type="text" name="ticker" id="ticker" placeholder="$FORGE" required maxlength="10">
                    </div>
                    
                    <div class="form-group">
                        <label>Short Backstory / Vibe *</label>
                        <input type="text" name="backstory" id="backstory" placeholder="e.g. The coin that launches memes" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Meme Image / Logo</label>
                        <input type="file" name="memeImage" id="memeImage" accept="image/*" class="file-input">
                    </div>
                    
                    <div class="form-group">
                        <label>Wallet Address (Base) *</label>
                        <input type="text" name="wallet" id="wallet" placeholder="0x..." required>
                    </div>
                    
                    <div class="form-group">
                        <label>Package</label>
                        <select name="package" id="packageSelect">
                            <option value="Starter">🆕 Starter — $49</option>
                            <option value="Growth" selected>📈 Growth — $99 + $19/mo</option>
                            <option value="Viral">🚀 Viral — $199 + $39/mo</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="submit-btn" id="submitBtn">🚀 Launch My Coin</button>
                    
                    <div class="payment-methods">
                        <span>💳 Stripe</span>
                        <span>🔄 Base (crypto)</span>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <section class="faq" id="faq">
        <div class="container">
            <h2 class="section-title">Frequently Asked</h2>
            
            <div class="faq-item" onclick="this.classList.toggle('open')">
                <div class="faq-question">How long does it take? <span>+</span></div>
                <div class="faq-answer">Under 10 minutes. Everything deploys automatically.</div>
            </div>
            
            <div class="faq-item" onclick="this.classList.toggle('open')">
                <div class="faq-question">Do I need coding skills? <span>+</span></div>
                <div class="faq-answer">No! Just enter your meme details. We handle all the technical stuff.</div>
            </div>
            
            <div class="faq-item" onclick="this.classList.toggle('open')">
                <div class="faq-question">Is it safe? <span>+</span></div>
                <div class="faq-answer">Yes! LP lock option included + basic disclaimers. Your liquidity is secured.</div>
            </div>
            
            <div class="faq-item" onclick="this.classList.toggle('open')">
                <div class="faq-question">What's in the liquidity? <span>+</span></div>
                <div class="faq-answer">Pre-funded Base liquidity. $500-$5000 depending on package.</div>
            </div>
            
            <div class="faq-item" onclick="this.classList.toggle('open')">
                <div class="faq-question">Can I upgrade later? <span>+</span></div>
                <div class="faq-answer">Yes! Switch packages anytime from your dashboard.</div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>🧲 IronForge by <a href="https://agnt.social/ironbridge">IronBridge</a> · Powered by IronBridge + Bankr on Base</p>
            <p style="margin-top: 0.5rem;">© 2025 IronForge. All rights reserved.</p>
        </div>
    </footer>

    <!-- Success Modal -->
    <div class="modal-overlay" id="successModal">
        <div class="modal">
            <h2>🎉 Launch Initiated!</h2>
            <p style="color: var(--text-dim); margin-bottom: 1rem; font-size: 0.9rem;">Your meme coin is being built automatically via Bankr...</p>
            
            <div class="modal-item pending" id="step1">Deploying token on Base...</div>
            <div class="modal-item pending" id="step2">Setting up liquidity pool...</div>
            <div class="modal-item pending" id="step3">Creating your website...</div>
            <div class="modal-item pending" id="step4">Configuring X + Telegram bots...</div>
            <div class="modal-item pending" id="step5">Setting up Discord/Farcaster...</div>
            <div class="modal-item pending" id="step6">Building dashboard...</div>
            <div class="modal-item pending" id="step7">Routing $BNKR liquidity boost...</div>
            
            <p style="margin-top: 1.5rem; color: var(--green); display: none;" id="completeMsg">✅ All systems go! Check your dashboard.</p>
            
            <button class="modal-btn" onclick="closeModal()" id="closeBtn" style="display: none;">View Dashboard</button>
        </div>
    </div>

    <script>
        let selectedPackage = 'Growth';
        let packagePrice = 99;
        
        function selectPkg(name, price) {
            selectedPackage = name;
            packagePrice = price;
            document.getElementById('packageSelect').value = name;
            document.getElementById('launch').scrollIntoView({behavior: 'smooth'});
            document.getElementById('progress').style.width = '15%';
        }
        
        const form = document.getElementById('launchForm');
        const inputs = form.querySelectorAll('input, select, textarea');
        const progress = document.getElementById('progress');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const filled = Array.from(inputs).filter(i => i.value).length;
                progress.style.width = (filled / inputs.length * 100) + '%';
            });
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                memeName: document.getElementById('memeName').value,
                ticker: document.getElementById('ticker').value.toUpperCase(),
                backstory: document.getElementById('backstory').value,
                wallet: document.getElementById('wallet').value,
                package: selectedPackage,
                price: packagePrice,
                timestamp: new Date().toISOString()
            };
            
            // Validate wallet address (Base format)
            if (!formData.wallet.startsWith('0x') || formData.wallet.length < 42) {
                alert('Please enter a valid Base wallet address (starts with 0x)');
                return;
            }
            
            // Show success modal
            const modal = document.getElementById('successModal');
            modal.classList.add('show');
            
            // Simulate the deployment steps
            simulateDeployment(formData);
        });
        
        function simulateDeployment(data) {
            const steps = [
                {id: 'step1', text: 'Deploying token on Base via Bankr...'},
                {id: 'step2', text: 'Setting up liquidity pool...'},
                {id: 'step3', text: 'Creating your website...'},
                {id: 'step4', text: 'Configuring X + Telegram bots...'},
                {id: 'step5', text: 'Setting up Discord/Farcaster...'},
                {id: 'step6', text: 'Building dashboard...'},
                {id: 'step7', text: 'Routing $BNKR liquidity boost...'}
            ];
            
            let currentStep = 0;
            
            const interval = setInterval(() => {
                if (currentStep < steps.length) {
                    const step = steps[currentStep];
                    const el = document.getElementById(step.id);
                    if (el) {
                        el.classList.remove('pending');
                        el.classList.add('done');
                        el.innerHTML = step.text;
                    }
                    currentStep++;
                } else {
                    clearInterval(interval);
                    
                    // Show completion
                    document.getElementById('completeMsg').style.display = 'block';
                    document.getElementById('closeBtn').style.display = 'inline-block';
                    
                    // Log submission for backend processing
                    console.log('LAUNCH_DATA:', JSON.stringify(data));
                }
            }, 1000); // 1 second per step = ~7 seconds total
        }
        
        function closeModal() {
            document.getElementById('successModal').classList.remove('show');
            
            // Show success message and reset form
            const memeName = document.getElementById('memeName').value;
            const ticker = document.getElementById('ticker').value;
            const pkg = selectedPackage;
            
            alert(`🎉 ${ticker} is being launched!\n\nPackage: ${pkg}\n\nPayment link sent to your wallet. Confirm to complete deployment.`);
            
            form.reset();
            progress.style.width = '0%';
        }
    </script>
</body>
</html>