<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Data\ClaudeAnswerData;
use App\Profiles\Values\ClaudeStatus;
use Illuminate\Contracts\Config\Repository;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * Claude Code as every sign-in method runs it on the host: the configured program, with the account folder as its
 * CLAUDE_CONFIG_DIR and HOME and nothing else of the host's configuration, and its status read from
 * `claude auth status --json`.
 */
final readonly class ClaudeDriver
{
    /**
     * A folder whose security(1) always fails, put first on the PATH so Claude Code never reaches a macOS Keychain
     * and keeps its login in the account folder's .credentials.json on every host.
     */
    private const string NO_KEYCHAIN = 'tools/accounts/no-keychain';

    public function __construct(
        private Repository $config,
        private SignInEgress $egress,
    ) {}

    /**
     * Runs the program in the account folder, with extra variables that name no secret and files it reads on their
     * own descriptors.
     *
     * @param  list<string>  $arguments
     * @param  array<string, string>  $variables
     * @param  array<int, string>  $readFiles
     */
    public function start(
        array $arguments,
        string $directory,
        array $variables = [],
        array $readFiles = [],
    ): PrivateAccountProcess {
        $command = [$this->config->string('accounts.claude_program'), ...$arguments];
        $environment = $this->environment($directory) + $variables;

        return PrivateAccountProcess::start($command, $environment, $directory, $readFiles);
    }

    /**
     * @param  array<string, string>  $variables
     * @param  array<int, string>  $readFiles
     */
    public function status(string $directory, array $variables = [], array $readFiles = []): ClaudeStatus
    {
        $process = $this->start(['auth', 'status', '--json'], $directory, $variables, $readFiles);

        return ClaudeStatus::fromJson($process->finish());
    }

    /**
     * What one short model call, with no tools and no saved session, says against the provider: nothing when it answers
     * without an error within the check's time limit, the provider's refusal when it does not. It is the only proof a
     * key or token works, since the status trusts any value it is given.
     *
     * @param  array<string, string>  $variables
     * @param  array<int, string>  $readFiles
     */
    public function modelRefusal(string $directory, array $variables = [], array $readFiles = []): string|null
    {
        $arguments = ['-p', 'Reply with OK.', '--output-format', 'json', '--max-turns', '1', '--tools', '',
            '--no-session-persistence'];

        $process = $this->start($arguments, $directory, $variables, $readFiles);
        // claude -p reads its standard input to the end before it answers.
        $process->closeInput();
        $output = $process->finish();

        try {
            $answer = ClaudeAnswerData::from(json_decode($output, true, 512, JSON_THROW_ON_ERROR));
        } catch (JsonException|CannotCreateData|TypeError) {
            return 'Claude Code gave no readable answer.';
        }

        if ($process->exitCode() === 0 && ! $answer->isError) {
            return null;
        }

        return $answer->result === '' ? 'Claude Code could not reach the model.' : $answer->result;
    }

    /**
     * @return array<string, string>
     */
    private function environment(string $directory): array
    {
        return [
            'PATH' => base_path(self::NO_KEYCHAIN).PATH_SEPARATOR.(string) getenv('PATH'),
            'HOME' => $directory,
            'CLAUDE_CONFIG_DIR' => $directory,
            ...$this->egress->variables(),
        ];
    }
}
