<?php

declare(strict_types=1);

namespace App\Support;

use App\Attributes\Authorize;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\Command;
use App\Enums\AccessRuleType;
use App\Values\AccessDecision;
use App\Values\AgentText;
use App\Values\StartProfileAuthority;

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
            return AccessDecision::refused(
                AccessRuleType::NotGranted,
                AgentText::of('core.access.no_application_command', ['command' => $command]),
            );
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
            return AccessDecision::allowed(
                AccessRuleType::ScopeGrant,
                AgentText::of('core.access.no_profile_limits_actor'),
            );
        }

        return $authority->profile->authorization->admits($command, $authorize);
    }
}
