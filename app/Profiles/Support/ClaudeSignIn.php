<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Exceptions\SignInCodeInvalid;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInCode;
use App\Profiles\Values\SignInVerification;
use Illuminate\Contracts\Config\Repository;

/**
 * Claude Code's own sign-in on the host, into one private account folder: `claude auth login --claudeai` with the
 * folder as CLAUDE_CONFIG_DIR and nothing else of the host's configuration, the sign-in address read from its private
 * output, the person's code typed on its standard input, and `claude auth status --json` as the check. The program
 * exchanges every token itself; nothing here sees one.
 */
final readonly class ClaudeSignIn implements SignInProtocol
{
    public function __construct(private Repository $config) {}

    public function begin(string $directory): PrivateAccountProcess
    {
        return PrivateAccountProcess::start(
            [$this->program(), 'auth', 'login', '--claudeai'],
            $this->environment($directory),
            $directory,
        );
    }

    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null
    {
        $address = $this->addressFrom($process);

        return $address === null ? null : new SignInChallenge($address, null);
    }

    public function acceptCode(PrivateAccountProcess $process, string $code): void
    {
        $this->submitCode($process, $code);
    }

    public function hasFinished(PrivateAccountProcess $process): bool
    {
        return ! $process->isRunning();
    }

    public function verify(string $directory): SignInVerification
    {
        $status = PrivateAccountProcess::start(
            [$this->program(), 'auth', 'status', '--json'],
            $this->environment($directory),
            $directory,
        );
        $decoded = json_decode($status->finish(), true);
        $report = is_array($decoded) ? $decoded : [];
        $configDirectory = $report['configDirectory'] ?? $directory;
        $isSignedIn = ($report['loggedIn'] ?? false) === true
            && ($report['authMethod'] ?? null) === 'claude.ai'
            && $configDirectory === $directory;
        $email = $report['email'] ?? null;

        $identity = $isSignedIn && is_string($email) ? $email : null;

        return new SignInVerification($isSignedIn, $identity, is_array($decoded));
    }

    /**
     * The address the person opens to approve the sign-in, as the program printed it; none until it did.
     */
    public function addressFrom(PrivateAccountProcess $process): string|null
    {
        return preg_match('~https://\S+~', $process->output(), $match) === 1 ? $match[0] : null;
    }

    /**
     * Types the person's code into the program; a code that is empty, too long or holds a control character never
     * reaches it.
     *
     * @throws SignInCodeInvalid
     */
    public function submitCode(PrivateAccountProcess $process, string $code): void
    {
        $process->send(SignInCode::from($code)->code);
    }

    private function program(): string
    {
        return $this->config->string('accounts.claude_program');
    }

    /**
     * @return array<string, string>
     */
    private function environment(string $directory): array
    {
        return [
            'PATH' => (string) getenv('PATH'),
            'HOME' => $directory,
            'CLAUDE_CONFIG_DIR' => $directory,
        ];
    }
}
