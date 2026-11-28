<?php

declare(strict_types=1);

namespace App\Access;

use App\Actors\Contracts\AgentTexts;
use App\Actors\Contracts\CurrentActor;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandAdmission;
use App\Bus\Values\CommandDecision;
use App\Bus\Values\EffectiveCommand;
use App\Engine\Enums\RefusalCode;
use App\Profiles\Enums\AccessRuleType;
use App\Sessions\Contracts\CurrentSession;
use App\Support\CommandRegistry;
use App\Values\AccessDecision;
use App\Values\AgentText;
use App\Values\StartProfileAuthority;

/**
 * Whether the acting actor's profile admits an application command: the one decision stack admission, ask answers,
 * supervisor coverage and MCP discovery all read. An actor without a start profile is not limited by one.
 */
final readonly class CommandAdmissions implements CommandAdmission
{
    public function __construct(
        private CurrentActor $actors,
        private CommandRegistry $commands,
        private CurrentSession $session,
        private AgentTexts $texts,
    ) {}

    /**
     * The bus's admission of a command run in a session: a command its profile does not admit is refused in words.
     */
    public function assess(EffectiveCommand $command): CommandDecision
    {
        $authorize = $command->authorize;

        if ($this->session->hasSession() && $authorize !== null) {
            $decision = $this->admitsDeclared($command->command::class, $authorize);

            if (! $decision->isAllowed) {
                return CommandDecision::refuse(RefusalCode::Forbidden, $this->texts->render($decision->reason));
            }
        }

        return CommandDecision::allow();
    }

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
