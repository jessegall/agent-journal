<?php

declare(strict_types=1);

namespace App\Support;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\Entry;
use App\Attributes\RepeatableRead;
use App\Attributes\RequiresRequestKey;
use App\Attributes\RetainedActorRequestKey;
use App\Concerns\Reflects;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Reviews\CommandEffectType;
use App\Exceptions\CommandDeclarationInvalid;

/**
 * One command an owner lists, with the handler of its name, and what its attributes declare: an application
 * command declares at most one Authorize and no Entry, a trusted command one non-application Entry and no Authorize.
 */
final readonly class DeclaredCommand
{
    use Reflects;

    /**
     * @param  class-string  $command
     * @param  class-string  $handler
     */
    private function __construct(
        public string $command,
        public CommandOwner $owner,
        public string $handler,
        public Authorize|null $authorize,
        public CommandEntry $entry,
    ) {}

    /**
     * Reads the command's declaration once and refuses any other form.
     *
     * @param  class-string  $command
     * @param  class-string  $handler
     *
     * @throws CommandDeclarationInvalid
     */
    public static function read(string $command, CommandOwner $owner, string $handler): self
    {
        $declaration = Reflector::of($command);
        $authorizations = $declaration->attributes(Authorize::class);
        $entries = $declaration->attributes(Entry::class);

        $entry = $entries->first()
            ->map(fn (Entry $declared) => $declared->entry)
            ->getOrElse(CommandEntry::Application);

        $fault = match (true) {
            count($authorizations) > 1 || count($entries) > 1 => 'it declares Authorize or Entry twice',
            count($authorizations) > 0 && count($entries) > 0 => 'it declares both Authorize and Entry',
            count($entries) > 0 && $entry === CommandEntry::Application => 'an application command needs no Entry',
            default => null,
        };

        if ($fault !== null) {
            throw CommandDeclarationInvalid::for($command, $fault);
        }

        $authorize = $authorizations->first()->getOrElse(null);

        return new self($command, $owner, $handler, $authorize, $entry);
    }

    public function isRepeatableReadNeeded(): bool
    {
        return $this->reflect($this->command)->hasAttribute(RepeatableRead::class);
    }

    public function effect(): CommandEffectType
    {
        return $this->reflect($this->command)->attributes(Effect::class)->first()
            ->map(fn (Effect $declared) => $declared->type)
            ->getOrElse(CommandEffectType::StateChange);
    }

    public function hasActorScopedReceipt(): bool
    {
        return $this->reflect($this->command)->hasAttribute(RetainedActorRequestKey::class);
    }

    /**
     * Whether every call of the command must carry a request key: one that keeps its receipt, or its actor's.
     */
    public function isRequestKeyRequired(): bool
    {
        return $this->reflect($this->command)->hasAttribute(RequiresRequestKey::class)
            || $this->hasActorScopedReceipt();
    }

    /**
     * The retention a command's RequiresRequestKey or RetainedActorRequestKey declares, or the standard one.
     *
     * @throws CommandDeclarationInvalid when it declares both
     */
    public function retention(): ReceiptRetention
    {
        $declaration = $this->reflect($this->command);
        $requiresKey = $declaration->hasAttribute(RequiresRequestKey::class);
        $retainsKey = $declaration->hasAttribute(RetainedActorRequestKey::class);

        if ($requiresKey && $retainsKey) {
            $conflictingAttributes = 'it declares both RequiresRequestKey and RetainedActorRequestKey';

            throw CommandDeclarationInvalid::for($this->command, $conflictingAttributes);
        }

        if ($retainsKey) {
            return ReceiptRetention::retainedForActor(
                $this->command,
                $declaration->attribute(RetainedActorRequestKey::class),
            );
        }

        if ($requiresKey) {
            return ReceiptRetention::declaredBy($this->command, $declaration->attribute(RequiresRequestKey::class));
        }

        return ReceiptRetention::standard();
    }

    /**
     * What PHP declares about the command class.
     *
     * @return Reflector<object>
     */
    public function declaration(): Reflector
    {
        return $this->reflect($this->command);
    }
}
