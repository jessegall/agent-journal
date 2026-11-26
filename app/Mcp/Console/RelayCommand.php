<?php

declare(strict_types=1);

namespace App\Mcp\Console;

use App\Api\AgentRequestClient;
use App\Exceptions\ApiDeadlinePassed;
use App\Exceptions\JournalUnreachable;
use App\Mcp\Servers\JournalServer;
use App\Mcp\Support\RelayFrames;
use App\Sessions\Contracts\SessionTokenSource;
use App\Sessions\Exceptions\SessionTokenRefused;
use App\Sessions\Exceptions\StartSettingMissing;
use Illuminate\Console\Command;
use Symfony\Component\Console\Attribute\AsCommand;

/**
 * The MCP server a started driver runs on stdio: each frame goes to the journal as one signed call whose body is
 * the frame's exact bytes, and each answer comes back as one line. It reads no journal data itself.
 */
#[AsCommand(name: 'mcp:relay', description: "Pass a started driver's MCP frames to the journal, signed")]
final class RelayCommand extends Command
{
    public function handle(SessionTokenSource $credentials, AgentRequestClient $client): int
    {
        try {
            $settings = $credentials->forThisStart();
        } catch (StartSettingMissing|SessionTokenRefused $refused) {
            fwrite(STDERR, $refused->getMessage()."\n");

            return self::FAILURE;
        }

        $frames = RelayFrames::standard();

        while (($frame = $frames->next()) !== null) {
            $call = $client->prepare($settings, JournalServer::PATH, $frame->bytes, $frame->admittedAt->getTimestamp());

            try {
                $frames->answer($frame, $client->sendPrepared($call, $frames->mcpHeaders($frame), $frame->deadline()));
            } catch (JournalUnreachable|ApiDeadlinePassed $unsent) {
                $frames->fail($frame, $unsent);
            }
        }

        return self::SUCCESS;
    }
}
