<?php

declare(strict_types=1);

namespace App\Mcp\Console;

use App\AgentRequests\Contracts\LaunchCredentialSource;
use App\AgentRequests\Exceptions\CallDeadlinePassed;
use App\AgentRequests\Exceptions\JournalUnreachable;
use App\AgentRequests\Exceptions\LaunchCredentialRefused;
use App\AgentRequests\Exceptions\LaunchSettingMissing;
use App\AgentRequests\Support\AgentRequestClient;
use App\Mcp\Servers\JournalServer;
use App\Mcp\Support\RelayFrames;
use Illuminate\Console\Command;
use Symfony\Component\Console\Attribute\AsCommand;

/**
 * The MCP server a launched program starts on stdio: each frame goes to the journal as one signed call whose body is
 * the frame's exact bytes, and each answer comes back as one line. It reads no journal data itself.
 */
#[AsCommand(name: 'mcp:relay', description: "Pass a launched program's MCP frames to the journal, signed")]
final class RelayCommand extends Command
{
    public function handle(LaunchCredentialSource $credentials, AgentRequestClient $client): int
    {
        try {
            $settings = $credentials->forThisLaunch();
        } catch (LaunchSettingMissing|LaunchCredentialRefused $refused) {
            fwrite(STDERR, $refused->getMessage()."\n");

            return self::FAILURE;
        }

        $frames = RelayFrames::standard();

        while (($frame = $frames->next()) !== null) {
            $call = $client->prepare($settings, JournalServer::PATH, $frame->bytes, $frame->admittedAt->getTimestamp());

            try {
                $frames->answer($frame, $client->sendPrepared($call, $frames->mcpHeaders($frame), $frame->deadline()));
            } catch (JournalUnreachable|CallDeadlinePassed $unsent) {
                $frames->fail($frame, $unsent);
            }
        }

        return self::SUCCESS;
    }
}
