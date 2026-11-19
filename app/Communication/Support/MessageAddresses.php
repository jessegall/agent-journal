<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Contracts\ActorResolver;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\ReceivesMessages;
use App\Actors\Contracts\SendsMessages;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\MessageAddressProvider;
use App\Communication\Contracts\MessageAddressResolver;
use App\Communication\Exceptions\ActorCannotSend;
use App\Communication\Support\Addresses\AgentAddresses;
use App\Communication\Support\Addresses\SystemAddresses;
use App\Communication\Support\Addresses\UserAddresses;
use Illuminate\Contracts\Container\Container;

/**
 * Message addresses through the provider each actor type has: an actor that cannot receive or send, or a type with no
 * provider, is refused.
 */
final readonly class MessageAddresses implements MessageAddressResolver
{
    /**
     * @var array<string, class-string<MessageAddressProvider>>
     */
    private const array PROVIDERS = [
        'agent' => AgentAddresses::class,
        'user' => UserAddresses::class,
        'system' => SystemAddresses::class,
    ];

    public function __construct(
        private ActorResolver $actors,
        private CurrentActor $current,
        private Container $container,
    ) {}

    public function requireReceiver(ActorIdentity $actor): void
    {
        if (! $this->actors->get($actor) instanceof ReceivesMessages) {
            throw ActorUnavailable::forIdentity($actor);
        }
    }

    public function recipient(ActorIdentity $actor, string|null $sessionId): MessageAddress
    {
        $this->requireReceiver($actor);
        $provider = self::PROVIDERS[$actor->type->value] ?? throw ActorUnavailable::forIdentity($actor);

        return $this->container->make($provider)->recipient($actor, $sessionId);
    }

    public function sender(): MessageAddress
    {
        $identity = ActorIdentity::of($this->current->actor());

        if (! $this->actors->get($identity) instanceof SendsMessages) {
            throw ActorCannotSend::forIdentity($identity);
        }

        $provider = self::PROVIDERS[$identity->type->value] ?? throw ActorCannotSend::forIdentity($identity);

        return $this->container->make($provider)->sender($identity);
    }
}
