<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Processes\Api\ProposeRulePayload;
use Illuminate\Console\Command;

/**
 * Proposes a declaration for a command request: --declaration is the rule and its examples as JSON.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeProposeCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'command-type:propose {request : The command request id} {--declaration= : The rule and its examples as JSON} {--evidence= : Why the declared effects are right} {--request-key= : The key that makes a retry the same proposal} {--json}';

    protected $description = 'Propose a declaration for a command request';

    public function handle(): int
    {
        $declaration = $this->jsonOption('declaration');

        if ($declaration === null) {
            return self::FAILURE;
        }

        return $this->runCall(ProposeRulePayload::from([
            'commandRequest' => (string) $this->argument('request'),
            'declaration' => [...$declaration, 'evidence' => (string) $this->option('evidence')],
            'requestKey' => $this->requestKey(),
        ]));
    }
}
