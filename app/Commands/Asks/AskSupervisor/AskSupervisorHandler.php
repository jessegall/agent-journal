<?php

declare(strict_types=1);

namespace App\Commands\Asks\AskSupervisor;

use App\Commands\Asks\RouteAsk\RouteAskCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Work\AgentFocuses;
use App\Enums\Asks\AskOriginType;
use App\Exceptions\AskRefused;
use App\Models\Asks\Ask;
use App\Models\Asks\AskRequester;
use App\Support\ActorIdentity;
use App\Support\AskService;
use App\Support\AskTypeRegistry;
use App\Values\AskReference;

final readonly class AskSupervisorHandler implements CommandHandler
{
    private const int OPEN_LIMIT = 5;

    public function __construct(
        private AgentFocuses $focuses,
        private AskTypeRegistry $types,
        private AskService $opening,
        private CommandBus $commands,
    ) {}

    public function handle(AskSupervisorCommand $command): AskReference
    {
        $requester = ActorIdentity::of($command->dispatchedBy());
        $body = trim($command->body);
        AskRefused::assertValidSubmission($body, $command->submissionKey);
        AskRequester::create($requester);

        $type = $this->types->get($command->typeKey());
        $retained = Ask::findSubmission($requester, $command->submissionKey);

        if ($retained->isDefined()) {
            return $retained->get()->replay($type->key(), $body);
        }

        if (Ask::resolveOpenSubmissions($requester) >= self::OPEN_LIMIT) {
            throw AskRefused::openLimit(self::OPEN_LIMIT);
        }

        $work = $this->focuses->focusOf($requester)->getOrElse(null);

        $ask = $this->opening->open(
            $requester,
            $type,
            $command->submissionKey,
            $body,
            $work,
            AskOriginType::Supervisor,
        );

        $this->commands->run(new RouteAskCommand($ask->reference, 0));

        return $ask->reference;
    }
}
