<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Calls\Scripts\SaveProfileDraftCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

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
        $commands = $this->jsonOption('commands');

        if ($commands === null) {
            return self::FAILURE;
        }

        return $this->runCall(SaveProfileDraftCall::from([
            'requestKey' => $this->requestKey(),
            'profile' => (string) $this->argument('profile'),
            'expectedRevision' => (int) $this->option('expected-revision'),
            'source' => $source === '-' ? (string) stream_get_contents(STDIN) : $source,
            'commands' => $commands,
        ]));
    }
}
