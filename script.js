document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // NAVEGAÇÃO ENTRE SEÇÕES
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = {
        home: document.getElementById('section-home'),
        sobre: document.getElementById('section-sobre'),
        contato: document.getElementById('section-contato')
    };

    function showSection(sectionId) {
        Object.values(sections).forEach(sec => sec.classList.remove('active'));
        if (sections[sectionId]) sections[sectionId].classList.add('active');
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
        document.querySelectorAll('.footer-links a[data-section]').forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            if (this.dataset.section) showSection(this.dataset.section);
        });
    });

    document.querySelectorAll('.footer-links a[data-section]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            if (this.dataset.section) showSection(this.dataset.section);
        });
    });

    // ==========================================
    // FORMULÁRIO DE CONTATO → WHATSAPP
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const phoneNumber = '5538999894056';

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !message) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        let text = `Olá! Meu nome é ${name}.`;
        text += `\nE-mail: ${email}`;
        if (phone) text += `\nTelefone: ${phone}`;
        text += `\n\nMensagem:\n${message}`;
        text += `\n\nEnviado via OR System - Analisador Google Meu Negócio`;

        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    });

    // ==========================================
    // ANALISADOR GOOGLE MEU NEGÓCIO
    // ==========================================
    const urlInput = document.getElementById('business-url');
    const btnContinue = document.getElementById('btn-continue');
    const btnBack = document.getElementById('btn-back');
    const btnAnalyze = document.getElementById('btn-analyze');
    const btnNewAnalysis = document.getElementById('btn-new-analysis');
    const btnSendWhatsapp = document.getElementById('btn-send-whatsapp');

    const stepUrl = document.getElementById('step-url');
    const stepQuiz = document.getElementById('step-quiz');
    const stepReport = document.getElementById('step-report');

    let answers = {
        photos: null,
        reviews: null,
        rating: null,
        replies: null,
        posts: null,
        info: null,
        site: null,
        keywords: null
    };

    let businessInfo = { url: '', name: '', category: '' };

    // ==========================================
    // ETAPA 1 → VALIDAR URL
    // ==========================================
    const urlPatterns = [
        /google\.com\/maps/i,
        /maps\.app\.goo\.gl/i,
        /g\.page/i,
        /goo\.gl\/maps/i,
        /google\.com\/search/i
    ];

    function isValidGoogleUrl(url) {
        if (!url) return false;
        return urlPatterns.some(p => p.test(url));
    }

    urlInput.addEventListener('input', function () {
        const url = this.value.trim();
        btnContinue.disabled = !isValidGoogleUrl(url);
    });

    btnContinue.addEventListener('click', function () {
        const url = urlInput.value.trim();
        if (!isValidGoogleUrl(url)) {
            alert('Por favor, insira um link válido do Google (Maps ou Meu Negócio).');
            return;
        }
        businessInfo.url = url;
        stepUrl.style.display = 'none';
        stepQuiz.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // ETAPA 2 → QUESTIONÁRIO
    // ==========================================
    const optionGroups = document.querySelectorAll('.options');

    optionGroups.forEach(group => {
        const questionKey = group.dataset.question;
        const buttons = group.querySelectorAll('button');

        buttons.forEach(btn => {
            btn.addEventListener('click', function () {
                buttons.forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                answers[questionKey] = parseInt(this.dataset.value);
                checkQuizComplete();
            });
        });
    });

    function checkQuizComplete() {
        const allAnswered = Object.values(answers).every(v => v !== null);
        const hasName = document.getElementById('q-name').value.trim().length > 0;
        const hasCategory = document.getElementById('q-category').value !== '';
        btnAnalyze.disabled = !(allAnswered && hasName && hasCategory);
    }

    document.getElementById('q-name').addEventListener('input', checkQuizComplete);
    document.getElementById('q-category').addEventListener('change', checkQuizComplete);

    btnBack.addEventListener('click', function () {
        stepQuiz.style.display = 'none';
        stepUrl.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnAnalyze.addEventListener('click', function () {
        businessInfo.name = document.getElementById('q-name').value.trim();
        businessInfo.category = document.getElementById('q-category').value;

        stepQuiz.style.display = 'none';
        stepReport.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        generateReport();
    });

    // ==========================================
    // LÓGICA DE ANÁLISE
    // ==========================================
    const categories = [
        {
            key: 'photos',
            name: 'Fotos',
            icon: 'fa-camera',
            weight: 1,
            feedback: {
                0: { title: 'Sem fotos no perfil', tip: 'Adicione no mínimo 10 fotos: fachada, interior, produtos e equipe. Perfis com fotos recebem 42% mais pedidos de rota e 35% mais cliques no site.' },
                1: { title: 'Poucas fotos', tip: 'Aumente para pelo menos 15 fotos. Adicione fotos reais e de qualidade — evite imagens de banco de imagens.' },
                2: { title: 'Boa quantidade de fotos', tip: 'Você está no caminho certo! Continue postando fotos novas toda semana para se manter ativo.' },
                3: { title: 'Excelente quantidade de fotos', tip: 'Parabéns! Continue atualizando com fotos novas regularmente para manter o engajamento.' }
            }
        },
        {
            key: 'reviews',
            name: 'Avaliações',
            icon: 'fa-star',
            weight: 1.2,
            feedback: {
                0: { title: 'Nenhuma avaliação', tip: 'Peça avaliações aos seus clientes fiéis. Envie o link do Google por WhatsApp após cada venda. Avaliações são o fator #1 de decisão local.' },
                1: { title: 'Poucas avaliações', tip: 'Você precisa de mais volume. Crie uma meta: pelo menos 5 avaliações novas por mês. Crie um QR Code para clientes avaliarem no balcão.' },
                2: { title: 'Boa quantidade de avaliações', tip: 'Continue incentivando avaliações. Empresas com 50+ avaliações aparecem 2x mais nas buscas locais.' },
                3: { title: 'Excelente volume de avaliações', tip: 'Continue mantendo esse ritmo. Responda todas para mostrar engajamento.' }
            }
        },
        {
            key: 'rating',
            name: 'Nota Média',
            icon: 'fa-medal',
            weight: 1.2,
            feedback: {
                0: { title: 'Nota crítica (abaixo de 3,0)', tip: 'Sua nota está afastando clientes. Foque em: 1) Resolver os problemas reais relatados; 2) Pedir avaliações a clientes satisfeitos para diluir as negativas; 3) Responder publicamente mostrando solução.' },
                1: { title: 'Nota mediana', tip: 'Você está na média. Suba para 4,5+ pedindo avaliações após bons atendimentos e melhorando pontos recorrentes nas críticas.' },
                2: { title: 'Boa nota', tip: 'Boa! Continue pedindo avaliações e resolvendo rapidamente qualquer reclamação.' },
                3: { title: 'Nota excelente', tip: 'Excelente! Sua nota é um diferencial competitivo. Mantenha o padrão de atendimento.' }
            }
        },
        {
            key: 'replies',
            name: 'Respostas',
            icon: 'fa-comments',
            weight: 1,
            feedback: {
                0: { title: 'Você nunca responde', tip: 'Responder avaliações é gratuito e melhora seu ranqueamento. Responda TODAS em até 24h. Agradeça as positivas e resolva as negativas com educação.' },
                1: { title: 'Responde às vezes', tip: 'Crie uma rotina: reserve 10 minutos por dia para responder avaliações. Isso melhora sua reputação e o algoritmo do Google.' },
                2: { title: 'Quase sempre responde', tip: 'Continue assim! Você está no top 20% das empresas. Só falta a consistência total.' },
                3: { title: 'Sempre responde', tip: 'Excelente! Você faz o que a maioria não faz. Continue sendo exemplo.' }
            }
        },
        {
            key: 'posts',
            name: 'Publicações',
            icon: 'fa-newspaper',
            weight: 0.8,
            feedback: {
                0: { title: 'Nunca publica', tip: 'Publique pelo menos 1x por semana: promoções, novidades, bastidores. Posts aparecem no seu perfil e em buscas, aumentando seu alcance.' },
                1: { title: 'Publica raramente', tip: 'Aumente a frequência. Meta: 1 post por semana. Use imagens de qualidade e chame para a ação ("venha conferir").' },
                2: { title: 'Publica mensalmente', tip: 'Bom, mas o ideal é semanal. Poste novidades, promoções e dicas do seu segmento.' },
                3: { title: 'Publica semanalmente', tip: 'Excelente! Você mantém o perfil ativo, o que agrada o algoritmo do Google.' }
            }
        },
        {
            key: 'info',
            name: 'Informações',
            icon: 'fa-circle-info',
            weight: 1,
            feedback: {
                0: { title: 'Informações incompletas', tip: 'Complete TUDO: horário de funcionamento, telefone, site, descrição, formas de pagamento, serviços. Perfis 100% completos recebem 7x mais cliques.' },
                1: { title: 'Faltam informações', tip: 'Revise seu perfil e complete tudo. Peça a alguém para olhar com olhos de cliente: o que está faltando?' },
                2: { title: 'Quase tudo completo', tip: 'Quase lá! Verifique se tem: horário especial para feriados, formas de pagamento e atributos do Google.' },
                3: { title: 'Perfil 100% completo', tip: 'Perfeito! Continue revisando a cada 3 meses para manter atualizado.' }
            }
        },
        {
            key: 'site',
            name: 'Site Vinculado',
            icon: 'fa-globe',
            weight: 1,
            feedback: {
                0: { title: 'Sem site próprio', tip: 'Crie um site simples ou uma landing page. O site dá credibilidade e é onde o cliente decide comprar. Comece com uma página de contato.' },
                1: { title: 'Site existe mas não vinculado', tip: 'Vincule HOJE. Vá em "Editar perfil" no Google Meu Negócio e cole a URL do seu site. Isso aumenta cliques em até 70%.' },
                2: { title: 'Site vinculado', tip: 'Ótimo! Certifique-se que o site é rápido (menos de 3s de carregamento) e mobile-friendly.' },
                3: { title: 'Site vinculado e otimizado', tip: 'Excelente! Invista em SEO local: coloque cidade e bairro no título e descrição.' }
            }
        },
        {
            key: 'keywords',
            name: 'Palavras-chave',
            icon: 'fa-magnifying-glass',
            weight: 0.8,
            feedback: {
                0: { title: 'Não conhece o conceito', tip: 'Palavras-chave são os termos que as pessoas digitam pra achar você. Ex: "pizzaria em BH", "salão de beleza zona sul". Use na descrição do perfil.' },
                1: { title: 'Não usa palavras-chave', tip: 'Inclua na descrição: seu serviço + cidade + bairro. Ex: "Oferecemos corte masculino em Belo Horizonte, bairro Savassi".' },
                2: { title: 'Usa algumas palavras-chave', tip: 'Aprofunde. Pesquise no Google o que as pessoas digitam para achar empresas como a sua e inclua 3-5 termos na descrição.' },
                3: { title: 'Usa e revisa sempre', tip: 'Excelente! Você entende SEO local. Continue acompanhando as tendências de busca do seu segmento.' }
            }
        }
    ];

    function generateReport() {
        // Calcular score geral (0-100)
        let totalPoints = 0;
        let maxPoints = 0;

        categories.forEach(cat => {
            const value = answers[cat.key];
            totalPoints += value * cat.weight;
            maxPoints += 3 * cat.weight;
        });

        const score = Math.round((totalPoints / maxPoints) * 100);

        // Preencher header
        document.getElementById('score-company').textContent = businessInfo.name;

        const scoreNumber = document.getElementById('score-number');
        const ringFill = document.getElementById('ring-fill');
        const scoreLabel = document.getElementById('score-label');
        const scoreSummary = document.getElementById('score-summary');

        // Animar número
        let currentNumber = 0;
        const increment = score / 40;
        const numberInterval = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= score) {
                currentNumber = score;
                clearInterval(numberInterval);
            }
            scoreNumber.textContent = Math.round(currentNumber);
        }, 30);

        // Animar anel
        const circumference = 327;
        const offset = circumference - (score / 100) * circumference;
        setTimeout(() => {
            ringFill.style.strokeDashoffset = offset;
        }, 100);

        // Cor do anel conforme score
        let ringColor = '#007BFF';
        if (score >= 80) ringColor = '#10b981';
        else if (score >= 60) ringColor = '#007BFF';
        else if (score >= 40) ringColor = '#f59e0b';
        else ringColor = '#ef4444';
        ringFill.style.stroke = ringColor;

        // Label e resumo
        let label, summary;
        if (score >= 80) {
            label = '⭐ Excelente';
            summary = `Parabéns! ${businessInfo.name} está muito bem posicionada no Google. Continue mantendo o perfil ativo e você colherá ainda mais resultados.`;
        } else if (score >= 60) {
            label = '👍 Bom';
            summary = `Bom trabalho! Mas ainda há espaço para crescer. Foque nos pontos abaixo para aumentar seu alcance local.`;
        } else if (score >= 40) {
            label = '⚠️ Precisa melhorar';
            summary = `${businessInfo.name} está deixando oportunidades na mesa. Veja abaixo o plano de ação e comece pelo prioridade 1.`;
        } else {
            label = '🚨 Crítico';
            summary = `Sua presença no Google está muito fraca e você está perdendo clientes todos os dias. Siga o plano de ação — as melhorias terão impacto rápido!`;
        }

        scoreLabel.textContent = label;
        scoreSummary.textContent = summary;

        // Cores do label
        scoreLabel.style.background = ringColor + '20';
        scoreLabel.style.color = ringColor;

        // ==========================================
        // CATEGORIAS
        // ==========================================
        const categoriesGrid = document.getElementById('categories-grid');
        categoriesGrid.innerHTML = '';

        categories.forEach(cat => {
            const value = answers[cat.key];
            const catPercent = Math.round((value / 3) * 100);

            let catLevel = 'critical';
            let catNote = 'Crítico';
            if (catPercent >= 90) { catLevel = 'excellent'; catNote = 'Excelente'; }
            else if (catPercent >= 70) { catLevel = 'good'; catNote = 'Bom'; }
            else if (catPercent >= 40) { catLevel = 'warning'; catNote = 'Atenção'; }

            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="cat-header">
                    <div class="cat-icon"><i class="fas ${cat.icon}"></i></div>
                    <h4>${cat.name}</h4>
                </div>
                <div class="cat-score">${catPercent}<small>/100</small></div>
                <div class="cat-bar">
                    <div class="cat-bar-fill ${catLevel}"></div>
                </div>
                <div class="cat-note">${catNote}</div>
            `;
            categoriesGrid.appendChild(card);

            setTimeout(() => {
                card.querySelector('.cat-bar-fill').style.width = catPercent + '%';
            }, 200);
        });

        // ==========================================
        // PONTOS FORTES E MELHORIAS
        // ==========================================
        const strengthsList = document.getElementById('strengths-list');
        const improvementsList = document.getElementById('improvements-list');
        const actionPlan = document.getElementById('action-plan');

        strengthsList.innerHTML = '';
        improvementsList.innerHTML = '';
        actionPlan.innerHTML = '';

        const sortedByScore = [...categories].sort((a, b) => answers[b.key] - answers[a.key]);

        // Pontos fortes (score 2 ou 3)
        const strengths = sortedByScore.filter(c => answers[c.key] >= 2);
        if (strengths.length === 0) {
            strengthsList.innerHTML = `
                <div class="tip-item warning">
                    <div class="tip-icon"><i class="fas fa-info"></i></div>
                    <div class="tip-content">
                        <h4>Ainda não há pontos fortes</h4>
                        <p>Seu perfil tem muitas oportunidades de melhoria. Veja o plano de ação abaixo e comece pelas prioridades 1 e 2.</p>
                    </div>
                </div>
            `;
        } else {
            strengths.slice(0, 4).forEach(cat => {
                const fb = cat.feedback[answers[cat.key]];
                const item = document.createElement('div');
                item.className = 'tip-item success';
                item.innerHTML = `
                    <div class="tip-icon"><i class="fas fa-check"></i></div>
                    <div class="tip-content">
                        <h4>${cat.name}: ${fb.title}</h4>
                        <p>${fb.tip}</p>
                    </div>
                `;
                strengthsList.appendChild(item);
            });
        }

        // Melhorias (score 0 ou 1)
        const weak = categories.filter(c => answers[c.key] <= 1).sort((a, b) => a.weight - b.weight).reverse();
        if (weak.length === 0) {
            improvementsList.innerHTML = `
                <div class="tip-item success">
                    <div class="tip-icon"><i class="fas fa-star"></i></div>
                    <div class="tip-content">
                        <h4>Nenhum ponto crítico!</h4>
                        <p>Parabéns! Todas as categorias estão em bom estado. Continue mantendo o trabalho consistente.</p>
                    </div>
                </div>
            `;
        } else {
            weak.slice(0, 5).forEach(cat => {
                const fb = cat.feedback[answers[cat.key]];
                const level = answers[cat.key] === 0 ? 'danger' : 'warning';
                const icon = answers[cat.key] === 0 ? 'fa-exclamation' : 'fa-arrow-up';
                const item = document.createElement('div');
                item.className = `tip-item ${level}`;
                item.innerHTML = `
                    <div class="tip-icon"><i class="fas ${icon}"></i></div>
                    <div class="tip-content">
                        <h4>${cat.name}: ${fb.title}</h4>
                        <p>${fb.tip}</p>
                    </div>
                `;
                improvementsList.appendChild(item);
            });
        }

        // ==========================================
        // PLANO DE AÇÃO (TOP 5 PRIORIDADES)
        // ==========================================
        const priorityItems = [...categories].map(cat => {
            const urgency = (3 - answers[cat.key]) * cat.weight;
            return {
                cat: cat,
                urgency: urgency,
                value: answers[cat.key],
                feedback: cat.feedback[answers[cat.key]]
            };
        }).filter(item => item.value < 3)
          .sort((a, b) => b.urgency - a.urgency)
          .slice(0, 5);

        if (priorityItems.length === 0) {
            actionPlan.innerHTML = `
                <div class="action-item">
                    <div class="action-priority p3"><i class="fas fa-trophy"></i></div>
                    <div class="action-content">
                        <h4>Tudo em ordem! 🎉</h4>
                        <p>Você completou todas as etapas. Continue monitorando seu perfil semanalmente e mantendo o trabalho consistente.</p>
                    </div>
                </div>
            `;
        } else {
            priorityItems.forEach((item, index) => {
                const priorityClass = index === 0 ? 'p1' : (index <= 2 ? 'p2' : 'p3');
                const el = document.createElement('div');
                el.className = 'action-item';
                el.innerHTML = `
                    <div class="action-priority ${priorityClass}">${index + 1}</div>
                    <div class="action-content">
                        <h4>${item.cat.name}: ${item.feedback.title}</h4>
                        <p>${item.feedback.tip}</p>
                    </div>
                `;
                actionPlan.appendChild(el);
            });
        }
    }

    // ==========================================
    // NOVA ANÁLISE / ENVIAR ESPECIALISTA
    // ==========================================
    btnNewAnalysis.addEventListener('click', function () {
        // Reset
        answers = {
            photos: null, reviews: null, rating: null, replies: null,
            posts: null, info: null, site: null, keywords: null
        };
        document.getElementById('q-name').value = '';
        document.getElementById('q-category').value = '';
        urlInput.value = '';
        document.querySelectorAll('.options button').forEach(b => b.classList.remove('selected'));
        btnContinue.disabled = true;
        btnAnalyze.disabled = true;

        stepReport.style.display = 'none';
        stepUrl.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnSendWhatsapp.addEventListener('click', function () {
        const score = document.getElementById('score-number').textContent;
        let text = `Olá! Fiz a análise do Google Meu Negócio da minha empresa *${businessInfo.name}*`;
        text += `\n\nLink do perfil: ${businessInfo.url}`;
        text += `\nNota geral: ${score}/100`;
        text += `\n\nGostaria de ajuda de um especialista para melhorar meus resultados.`;

        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    });

});