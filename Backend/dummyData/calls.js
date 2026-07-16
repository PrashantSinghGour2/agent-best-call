// Dummy call transcripts for demoing "Best Call of the Week".
// 10 agents x 2 calls each = 20 calls total.
// Each object mirrors what a real CCaaS transcript export would provide.

export const dummyCalls = [
  // --- AGT-101 : Meena Rao (Billing) --------------------------------------
  {
    caseId: 'CALL-2026-0001',
    agentId: 'AGT-101',
    agentName: 'Meena Rao',
    callDate: '2026-07-08',
    queue: 'Billing',
    ahtSeconds: 420,
    transcript:
      "Customer: This is my third time calling about the same refund and I'm honestly done with your company.\n" +
      "Agent: I completely understand how frustrating this must be, and I'm so sorry you've had to call three times. My name is Meena, and I'm going to take ownership of this right now. Let me pull up your case while we talk so you don't have to hold.\n" +
      "Customer: Fine, but I've heard that before.\n" +
      "Agent: I can see the refund was authorized on the 3rd but got stuck in a batch that never released. I'm going to push it through manually right now and stay on the line until I see it move to 'sent'. Give me about 45 seconds.\n" +
      "Customer: Okay... you're actually doing something?\n" +
      "Agent: Yes — I've submitted it, and I can now see the status is 'sent'. You should see it in your account within 2 business hours. I'm also adding a note so if it stalls again it comes straight to me.\n" +
      "Customer: Wow, thank you. That's the first real answer I've gotten.\n" +
      "Agent: You're very welcome, and I'm sorry it took three calls to get here. Is there anything else I can help with today?\n" +
      "Customer: No, that's perfect. Thanks Meena."
  },
  {
    caseId: 'CALL-2026-0002',
    agentId: 'AGT-101',
    agentName: 'Meena Rao',
    callDate: '2026-07-09',
    queue: 'Billing',
    ahtSeconds: 210,
    transcript:
      "Customer: Hi, I just wanted to confirm my autopay is set up.\n" +
      "Agent: Sure, one second. Yes, autopay is active on card ending 4421, next charge on the 15th.\n" +
      "Customer: Great, thanks.\n" +
      "Agent: You're welcome, bye."
  },

  // --- AGT-102 : Arjun Patel (Tech Support) -------------------------------
  {
    caseId: 'CALL-2026-0003',
    agentId: 'AGT-102',
    agentName: 'Arjun Patel',
    callDate: '2026-07-08',
    queue: 'Tech Support',
    ahtSeconds: 540,
    transcript:
      "Customer: My router keeps rebooting every ten minutes and I work from home, this is killing me.\n" +
      "Agent: That sounds really disruptive, especially mid-workday. I'm Arjun, let's fix this together. Can you tell me the model number on the back of the router?\n" +
      "Customer: It's an AC1900.\n" +
      "Agent: Perfect. There's actually a known firmware bug on that model when the 5GHz channel is set to auto. I'm going to walk you through a 90-second fix that will stop the reboots.\n" +
      "Customer: Okay.\n" +
      "Agent: (walks through settings)... great, and you can see the uptime counter has now reset and is climbing normally. I'll also send you a follow-up SMS in 24 hours to make sure it stays stable.\n" +
      "Customer: Thank you so much. Nobody else caught the firmware thing.\n" +
      "Agent: Happy to help — have a great rest of your day."
  },
  {
    caseId: 'CALL-2026-0004',
    agentId: 'AGT-102',
    agentName: 'Arjun Patel',
    callDate: '2026-07-10',
    queue: 'Tech Support',
    ahtSeconds: 900,
    transcript:
      "Customer: My internet is slow.\n" +
      "Agent: Have you tried restarting the router?\n" +
      "Customer: Yes, twice.\n" +
      "Agent: Um, let me put you on hold. (long silence 3 minutes) ... Sorry about that. Can you restart it again?\n" +
      "Customer: I just told you I did.\n" +
      "Agent: Right, um, I'll transfer you to tier 2.\n" +
      "Customer: Ugh, fine."
  },

  // --- AGT-103 : Sarah Chen (Sales) ---------------------------------------
  {
    caseId: 'CALL-2026-0005',
    agentId: 'AGT-103',
    agentName: 'Sarah Chen',
    callDate: '2026-07-09',
    queue: 'Sales',
    ahtSeconds: 480,
    transcript:
      "Customer: I was going to cancel my plan actually, it's gotten too expensive.\n" +
      "Agent: I appreciate you telling me directly. Before we cancel, may I look at your usage and see if there's a plan that fits you better? Sometimes there's real savings and I'd hate for you to leave and miss that.\n" +
      "Customer: Okay, one minute.\n" +
      "Agent: Thanks. So looking at the last 3 months you're using about 40GB — you're on the 200GB plan. If we move you to the 75GB plan you save $22/month and still have headroom.\n" +
      "Customer: Really? Why didn't anyone tell me before.\n" +
      "Agent: I'm going to switch you now, and I'll credit the difference for this month too. Anything else you'd like me to look at?\n" +
      "Customer: No, that's amazing. Thanks."
  },
  {
    caseId: 'CALL-2026-0006',
    agentId: 'AGT-103',
    agentName: 'Sarah Chen',
    callDate: '2026-07-11',
    queue: 'Sales',
    ahtSeconds: 300,
    transcript:
      "Customer: Hi, I want to add a second line.\n" +
      "Agent: Sure. It's $15/month extra, same features. Want me to add it now?\n" +
      "Customer: Yes.\n" +
      "Agent: Done. You'll get a SIM in 2 days. Anything else?\n" +
      "Customer: No thanks."
  },

  // --- AGT-104 : David Kim (Billing) --------------------------------------
  {
    caseId: 'CALL-2026-0007',
    agentId: 'AGT-104',
    agentName: 'David Kim',
    callDate: '2026-07-08',
    queue: 'Billing',
    ahtSeconds: 660,
    transcript:
      "Customer: Yeah I got double charged and I need it fixed today, I've got rent due.\n" +
      "Agent: I hear you — rent is not something to mess with. I'm David, let me look right now. Yes, I can see two charges of $89 on the 5th. That's clearly a system error. I'm reversing the duplicate immediately.\n" +
      "Customer: When will I see it back?\n" +
      "Agent: I'm expediting the reversal — you'll see it in your account within 30 minutes rather than the usual 3-5 days. I'll text you the reversal confirmation the moment it clears.\n" +
      "Customer: You're the first person today who actually listened. Thank you.\n" +
      "Agent: Of course. Anything else?\n" +
      "Customer: No, that's it."
  },
  {
    caseId: 'CALL-2026-0008',
    agentId: 'AGT-104',
    agentName: 'David Kim',
    callDate: '2026-07-10',
    queue: 'Billing',
    ahtSeconds: 720,
    transcript:
      "Customer: Why is my bill higher this month?\n" +
      "Agent: Let me check. It looks like a $10 late fee.\n" +
      "Customer: I paid on time.\n" +
      "Agent: The system shows it as late.\n" +
      "Customer: I have the receipt right here.\n" +
      "Agent: I can't do anything without escalation. Let me put you on hold. (5 minutes) ... I'm going to transfer you to disputes.\n" +
      "Customer: This is ridiculous."
  },

  // --- AGT-105 : Priya Sharma (Tech Support) ------------------------------
  {
    caseId: 'CALL-2026-0009',
    agentId: 'AGT-105',
    agentName: 'Priya Sharma',
    callDate: '2026-07-09',
    queue: 'Tech Support',
    ahtSeconds: 510,
    transcript:
      "Customer: I can't log into my account and I have a client meeting in 20 minutes.\n" +
      "Agent: Okay, we'll get you in before then. I'm Priya. Can you confirm the email on the account? ... great. I can see there's a lock from too many failed attempts. I'm clearing it now.\n" +
      "Customer: Okay.\n" +
      "Agent: Try logging in now with your existing password — I'll wait.\n" +
      "Customer: I'm in! Thank you so much.\n" +
      "Agent: Perfect timing. Before you go — I'd suggest setting up passkey login so this doesn't happen again. Want me to send you a one-click setup link?\n" +
      "Customer: Yes please, and thank you."
  },
  {
    caseId: 'CALL-2026-0010',
    agentId: 'AGT-105',
    agentName: 'Priya Sharma',
    callDate: '2026-07-11',
    queue: 'Tech Support',
    ahtSeconds: 360,
    transcript:
      "Customer: My app keeps crashing on iOS.\n" +
      "Agent: What version?\n" +
      "Customer: 18.2.\n" +
      "Agent: Known issue, update to 18.4 in the app store.\n" +
      "Customer: Okay.\n" +
      "Agent: Anything else?\n" +
      "Customer: No.\n" +
      "Agent: Bye."
  },

  // --- AGT-106 : Marcus Johnson (Retention) -------------------------------
  {
    caseId: 'CALL-2026-0011',
    agentId: 'AGT-106',
    agentName: 'Marcus Johnson',
    callDate: '2026-07-08',
    queue: 'Retention',
    ahtSeconds: 600,
    transcript:
      "Customer: I've decided to cancel and go with a competitor.\n" +
      "Agent: Thanks for calling in to tell me — a lot of people just walk. I'm Marcus, and I want to understand what's driving the decision before we do anything, is that okay?\n" +
      "Customer: Sure. Honestly, the outages last month killed it for me.\n" +
      "Agent: That's completely fair — you rely on us and we weren't reliable. I don't want to talk you out of leaving if we can't earn it back, but I do want to acknowledge that and offer two things: a service credit for the outage window and, if you'll try us for one more billing cycle, direct access to my extension if anything goes wrong.\n" +
      "Customer: Hm. Okay, one more cycle. But I'm watching.\n" +
      "Agent: That's more than fair. Credit is applied, and I'm sending you my direct extension by text right now."
  },
  {
    caseId: 'CALL-2026-0012',
    agentId: 'AGT-106',
    agentName: 'Marcus Johnson',
    callDate: '2026-07-10',
    queue: 'Retention',
    ahtSeconds: 240,
    transcript:
      "Customer: Cancel my account.\n" +
      "Agent: Okay, may I ask why?\n" +
      "Customer: I don't want to talk about it.\n" +
      "Agent: Understood. Account is cancelled effective end of billing cycle. You'll get a confirmation email.\n" +
      "Customer: Fine. Bye."
  },

  // --- AGT-107 : Aisha Ali (Billing) --------------------------------------
  {
    caseId: 'CALL-2026-0013',
    agentId: 'AGT-107',
    agentName: 'Aisha Ali',
    callDate: '2026-07-09',
    queue: 'Billing',
    ahtSeconds: 450,
    transcript:
      "Customer: I'm confused about this proration line on my bill.\n" +
      "Agent: Totally fair, prorations are confusing. I'm Aisha. Let me walk you through it in plain english. You upgraded plans on the 12th, so we billed you for 12 days on the old plan and 18 days on the new one, plus a small difference for the taxes. Want me to send you a one-page written breakdown by email?\n" +
      "Customer: That would actually be really helpful, yes.\n" +
      "Agent: Sending it now. And it's fully paid, no action needed on your side. Anything else?\n" +
      "Customer: No, that clears it up. Thank you."
  },
  {
    caseId: 'CALL-2026-0014',
    agentId: 'AGT-107',
    agentName: 'Aisha Ali',
    callDate: '2026-07-11',
    queue: 'Billing',
    ahtSeconds: 330,
    transcript:
      "Customer: I want to update my card on file.\n" +
      "Agent: Go to Settings > Payment methods and add the new card, then set it as default. Anything else?\n" +
      "Customer: Can you do it for me?\n" +
      "Agent: For security we can't take card info over the phone. It's a 30-second flow, I can stay on if you'd like.\n" +
      "Customer: Sure. ... okay done.\n" +
      "Agent: Perfect. Have a good day."
  },

  // --- AGT-108 : Liam O'Brien (Tech Support) ------------------------------
  {
    caseId: 'CALL-2026-0015',
    agentId: 'AGT-108',
    agentName: "Liam O'Brien",
    callDate: '2026-07-09',
    queue: 'Tech Support',
    ahtSeconds: 720,
    transcript:
      "Customer: My VPN drops every time I join a video call, and my whole team is on Zoom right now.\n" +
      "Agent: Ugh, that combo is brutal. I'm Liam. Quick question so I don't waste your time — are you on the corporate VPN or the personal one?\n" +
      "Customer: Corporate.\n" +
      "Agent: Got it. There's a known conflict between the corporate VPN client 4.2 and the Zoom low-bandwidth mode. Two options: I can push the 4.3 client to you now, which fixes it permanently, or if you need to be back on the call immediately, I can walk you through disabling low-bandwidth mode in Zoom in 15 seconds as a stopgap.\n" +
      "Customer: Do the 15-second thing now, do the update after.\n" +
      "Agent: Smart. Zoom > Settings > Video > uncheck 'Enable HD' at the bottom. Rejoin the call.\n" +
      "Customer: I'm back on. Amazing.\n" +
      "Agent: I'm queuing the 4.3 push for tonight at 8pm your time — it'll take 2 min and won't interrupt anything. Have a good meeting.\n" +
      "Customer: Thank you Liam, seriously."
  },
  {
    caseId: 'CALL-2026-0016',
    agentId: 'AGT-108',
    agentName: "Liam O'Brien",
    callDate: '2026-07-11',
    queue: 'Tech Support',
    ahtSeconds: 180,
    transcript:
      "Customer: How do I reset my password?\n" +
      "Agent: Use the 'forgot password' link on the login page.\n" +
      "Customer: Thanks.\n" +
      "Agent: Bye."
  },

  // --- AGT-109 : Emma Rossi (Sales) ---------------------------------------
  {
    caseId: 'CALL-2026-0017',
    agentId: 'AGT-109',
    agentName: 'Emma Rossi',
    callDate: '2026-07-08',
    queue: 'Sales',
    ahtSeconds: 540,
    transcript:
      "Customer: I'm shopping around and honestly your competitor is $10 cheaper.\n" +
      "Agent: Thanks for being upfront — I'd rather you tell me than not. I'm Emma. Can I ask what plan you're comparing?\n" +
      "Customer: Their 100GB plan.\n" +
      "Agent: Got it. Two things — one, our 100GB plan includes international roaming which theirs doesn't, so if you travel it saves you $8 per day. Two, if you don't travel I hear you, and I can match their price for the first 6 months while you decide. No pressure either way.\n" +
      "Customer: I do travel actually, a couple times a year.\n" +
      "Agent: Then honestly the roaming alone probably pays for the difference. Want to give it a shot for a month and I'll check back in?\n" +
      "Customer: Yeah, let's do it.\n" +
      "Agent: Signing you up now. And I'll set a reminder to call you in 30 days — if it's not working for you we'll switch, no questions asked."
  },
  {
    caseId: 'CALL-2026-0018',
    agentId: 'AGT-109',
    agentName: 'Emma Rossi',
    callDate: '2026-07-10',
    queue: 'Sales',
    ahtSeconds: 420,
    transcript:
      "Customer: I want to hear about your business plans.\n" +
      "Agent: We have Starter, Growth, and Enterprise.\n" +
      "Customer: What's the difference?\n" +
      "Agent: Different price, different features. It's on the website.\n" +
      "Customer: ...okay. I'll check.\n" +
      "Agent: Cool, bye."
  },

  // --- AGT-110 : Noah Williams (Retention) --------------------------------
  {
    caseId: 'CALL-2026-0019',
    agentId: 'AGT-110',
    agentName: 'Noah Williams',
    callDate: '2026-07-09',
    queue: 'Retention',
    ahtSeconds: 480,
    transcript:
      "Customer: I want to downgrade, I don't use half of what I'm paying for.\n" +
      "Agent: That's a totally reasonable reason to call. I'm Noah. Let me look at your last 60 days of usage instead of guessing. ... Yeah, you're right — you're using about 30% of what your plan gives you. The 'Lite' plan will cover you and save $18/month.\n" +
      "Customer: Any catches?\n" +
      "Agent: One thing worth flagging — if you go over the Lite cap you pay overage. Based on your history you're nowhere close, but if you ever have a heavy month you can bump back up any time with no penalty.\n" +
      "Customer: Fair. Switch me.\n" +
      "Agent: Done, effective next cycle so you don't lose what you already paid for. Anything else?\n" +
      "Customer: No, thanks for being straight with me."
  },
  {
    caseId: 'CALL-2026-0020',
    agentId: 'AGT-110',
    agentName: 'Noah Williams',
    callDate: '2026-07-11',
    queue: 'Retention',
    ahtSeconds: 90,
    transcript:
      "Customer: Cancel please.\n" +
      "Agent: Done. Bye."
  }
];
