# Agent Development Workflow

This document outlines the process for developing and deploying agents for PAIOS on Vercel.

## Prerequisites

1. Install Vercel CLI: `npm install -g vercel`
2. GitHub repository connected: https://github.com/Franksami/Paios
3. Vercel account created

## Initial Deployment

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select "Next.js" as the framework
   - Use default settings

3. **Set up production deployment:**
   ```bash
   vercel --prod
   ```

## Agent Development Process

For each agent (1-33), follow this workflow:

### 1. Create Feature Branch

```bash
git checkout -b agent-[number]-[name]
# Example: git checkout -b agent-1-business-intelligence
```

### 2. Implement Agent

1. **Update agent constants** in `shared/src/constants/agent-numbers.ts`
2. **Create agent display component** in `frontend/src/components/agents/displays/`
3. **Update mock API responses** in `frontend/src/app/api/agents/[id]/route.ts`
4. **Add voice commands** in `frontend/src/app/api/voice/route.ts`

### 3. Test Locally

```bash
cd frontend
npm run dev
```

- Test agent display
- Test voice commands
- Verify no console errors
- Check mobile responsiveness

### 4. Deploy Preview

```bash
vercel
```

This creates a preview URL for testing.

### 5. Test on Preview

- [ ] Agent displays correctly
- [ ] Voice commands work
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Previous agents still work

### 6. Commit and Tag

```bash
git add -A
git commit -m "feat: Agent #[num] - [Name]"
git tag v0.[agent-number].0
git push origin agent-[number]-[name] --tags
```

### 7. Deploy to Production

```bash
vercel --prod
```

### 8. Merge to Main

Create a pull request on GitHub and merge after verification.

## Version Control Strategy

- Each agent completion = new version tag
- Format: `v0.[agent-number].0`
- Example: `v0.1.0` for Agent 1, `v0.2.0` for Agent 2

## Testing Checklist

Before marking an agent as complete:

- [ ] UI displays correctly
- [ ] Voice commands processed
- [ ] Mock data realistic
- [ ] Error handling works
- [ ] Previous agents unaffected
- [ ] Mobile responsive
- [ ] Performance acceptable

## Environment Variables

The following are automatically set by `vercel.json`:

- `NEXT_PUBLIC_MOCK_MODE=true`
- `NEXT_PUBLIC_API_URL=/api`
- `NEXT_PUBLIC_VOICE_ENABLED=true`

## Monitoring

View deployment logs and analytics at:
- https://vercel.com/[your-username]/paios

## Troubleshooting

### Build Failures
- Check `vercel.json` configuration
- Verify all imports are correct
- Run `npm run build` locally first

### Voice Commands Not Working
- Check browser microphone permissions
- Verify HTTPS connection (required for Web Speech API)
- Test in Chrome/Edge (best support)

### Mock API Issues
- Check API route file names match pattern
- Verify JSON responses are valid
- Check browser console for errors