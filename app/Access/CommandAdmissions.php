<?php

declare(strict_types=1);

namespace App\Access;

use App\Actors\Contracts\CurrentActor;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\Command;
use App\Profiles\Enums\AccessRuleType;
use App\Support\CommandRegistry;
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
        return $this->commands->applicationAuthorizeOf($command)->map(
            fn (Authorize $authorize) => $this->admitsDeclared($command, $authorize),
        )->getOrCall(fn () => AccessDecision::refused(
            AccessRuleType::NotGranted,
            AgentText::of('core.access.no_application_command', ['command' => $command]),
        ));
    }

    /**
     * @param  class-string<Command<mixed>>  $command
     */
    public function admitsDeclared(string $command, Authorize $authorize): AccessDecision
    {
        return $this->actors->startProfileAuthority()->map(
            fn (StartProfileAuthority $authority) => $authority->profile->authorization->admits($command, $authorize),
        )->getOrCall(fn () => AccessDecision::allowed(
            AccessRuleType::ScopeGrant,
            AgentText::of('core.access.no_profile_limits_actor'),
        ));
    }
}
