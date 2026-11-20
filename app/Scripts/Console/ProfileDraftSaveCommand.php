<?php

declare(strict_types=1);

namespace App\Scripts\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Profiles\Exceptions\ProfileDraftRefused;
use App\Scripts\Calls\SaveProfileDraftCall;
use Illuminate\Console\Command;
use JsonException;

#[JournalRoute(JournalRouteType::Write)]
final class ProfileDraftSaveCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'profile:draft {profile} {--source=- : The script text, - for standard input}'
        .' {--commands={} : The command definitions as JSON} {--expected-revision=0} {--request-key=} {--json}';

    protected $description = 'Save script text and command definitions into a profile\'s shared draft';

    public function handle(): int
    {
        $source = (string) $this->option('source');

        return $this->runCall(SaveProfileDraftCall::from([
            'requestKey' => $this->requestKey(),
            'profile' => (string) $this->argument('profile'),
            'expectedRevision' => (int) $this->option('expected-revision'),
            'source' => $source === '-' ? (string) stream_get_contents(STDIN) : $source,
            'commands' => self::commands((string) $this->option('commands')),
        ]));
    }

    /**
     * @return array<string, mixed>
     */
    private static function commands(string $json): array
    {
        try {
            $commands = json_decode($json, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $failure) {
            throw ProfileDraftRefused::unreadable('--commands', $failure);
        }

        if (! is_array($commands)) {
            throw ProfileDraftRefused::unreadable('--commands');
        }

        return $commands;
    }
}
