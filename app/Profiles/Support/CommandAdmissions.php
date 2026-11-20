<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Enums\AccessRuleType;
use App\Agents\Values\AccessDecision;
use App\Bus\Attributes\Authorize;
use App\Bus\Contracts\Command;
use App\Bus\Support\CommandRegistry;
use App\Profiles\Values\StartProfileAuthority;

/**
 * Whether the acting actor's profile admits an application command: the one decision stack admission, ask answers,
 * supervisor coverage and MCP discovery all read. An actor without a start profile is not limited by one.
 */
final readonly class CommandAdmissions
{
    public function __construct(private CurrentActor $actors, private CommandRegistry $commands) {}

    /**
     * @param  class-string<Command<mixed>>  $command
     */
    public function admits(string $command): AccessDecision
    {
        $authorize = $this->commands->has($command) ? $this->commands->authorizeOf($command) : null;

        if ($authorize === null) {
            return AccessDecision::refused(AccessRuleType::NotGranted, "{$command} is no application command.");
        }

        return $this->admitsDeclared($command, $authorize);
    }

    /**
     * @param  class-string<Command<mixed>>  $command
     */
    public function admitsDeclared(string $command, Authorize $authorize): AccessDecision
    {
        $authority = $this->actors->hasActor() ? $this->actors->authority() : null;

        if (! $authority instanceof StartProfileAuthority) {
            return AccessDecision::allowed(AccessRuleType::ScopeGrant, 'No start profile limits this actor.');
        }

        return $authority->profile->authorization->admits($command, $authorize);
    }
}
