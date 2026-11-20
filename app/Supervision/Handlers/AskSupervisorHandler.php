<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Supervision\Commands\AskSupervisor;
use App\Supervision\Commands\RouteAsk;
use App\Supervision\Enums\AskOriginType;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Models\Ask;
use App\Supervision\Models\AskRequester;
use App\Supervision\Support\AskTypeRegistry;
use App\Supervision\Support\SupervisorGraphLock;
use App\Supervision\Support\SupervisorRouting;
use App\Supervision\Values\AskReference;

final readonly class AskSupervisorHandler implements CommandHandler
{
    private const int OPEN_LIMIT = 5;

    public function __construct(
        private ActorWorkStacks $stacks,
        private AskTypeRegistry $types,
        private SupervisorRouting $routes,
        private SupervisorGraphLock $graph,
        private CommandBus $commands,
    ) {}

    public function handle(AskSupervisor $command): AskReference
    {
        $requester = ActorIdentity::of($command->dispatchedBy());
        $body = trim($command->body);
        AskRefused::assertValidSubmission($body, $command->submissionKey);
        AskRequester::lockSubmissions($requester);

        $type = $this->types->get($command->typeKey());
        $retained = Ask::submission($requester, $command->submissionKey);

        if ($retained->isDefined()) {
            return $retained->get()->replay($type->key(), $body);
        }

        if (Ask::openSubmissions($requester) >= self::OPEN_LIMIT) {
            throw AskRefused::openLimit(self::OPEN_LIMIT);
        }

        $reference = Ask::newReference();
        $work = $this->stacks->currentRecord();
        $subject = $type->resolver()->resolve($type->subject(), $reference, $work->getOrElse(null));
        $this->graph->acquire();
        $route = $this->routes->routeFor($requester, $type->key());

        Ask::submit(
            $reference,
            $requester,
            $type->key(),
            $command->submissionKey,
            $body,
            $subject,
            $route->target,
            AskOriginType::Supervisor,
        );
        $this->commands->run(new RouteAsk($reference, 0));

        return $reference;
    }
}
