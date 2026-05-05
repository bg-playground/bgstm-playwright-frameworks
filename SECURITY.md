# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.x (pre-release) | Best-effort |

## Reporting a Vulnerability

We take security vulnerabilities seriously and appreciate responsible disclosure. Please **do not** report security vulnerabilities through public GitHub issues.

### Preferred Method: GitHub Security Advisories

1. Navigate to the [Security Advisories](https://github.com/bg-playground/bgstm-playwright-frameworks/security/advisories/new) page for this repository.
2. Click **"New draft security advisory"**.
3. Fill in the details of the vulnerability, including:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)
4. Submit the advisory. It will be kept private until we coordinate a fix and disclosure.

## Response Timeline

| Severity | Initial Response | Fix Timeline |
| -------- | ---------------- | ------------ |
| Critical | 24 hours | 7 days |
| High | 48 hours | 14 days |
| Medium | 48 hours | 30 days |
| Low | 5 business days | 90 days |

## Disclosure Policy

- Security issues will be kept confidential until a fix is released.
- We follow a **coordinated disclosure** model: we work with reporters to agree on a disclosure timeline.
- After a fix is deployed, we will publish a security advisory crediting the reporter (unless anonymity is requested).
- We request a minimum of **90 days** before public disclosure to allow time for patching.

## Security Best Practices for Users

- **Never commit secrets**: Use `.env` files and environment variable management for BGSTM tokens and API keys.
- **Keep dependencies updated**: Run `pnpm audit` regularly and review Dependabot PRs promptly.
- **Review access controls**: Limit who has write access to the repository and rotate access tokens regularly.
- **Enable two-factor authentication (2FA)** on all GitHub accounts with repository access.

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security/getting-started/github-security-features)
- [BGSTM Security Policy](https://github.com/bg-playground/BGSTM/security/policy)
