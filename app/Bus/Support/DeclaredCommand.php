<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Enums\CommandEntry;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use ReflectionClass;

/**
 * One command an owner lists, with the handler its HandledBy names, and what its attributes declare: an application
 * command declares one Authorize and no Entry, a trusted command one non-application Entry and no Authorize.
 */
final readonly class DeclaredCommand
{
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
        $reflection = new ReflectionClass($command);
        $authorizations = $reflection->getAttributes(Authorize::class);
        $entries = $reflection->getAttributes(Entry::class);
        $entry = $entries === [] ? CommandEntry::Application : $entries[0]->newInstance()->entry;

        $fault = match (true) {
            count($authorizations) > 1 || count($entries) > 1 => 'it declares Authorize or Entry twice',
            $authorizations !== [] && $entries !== [] => 'it declares both Authorize and Entry',
            $entries !== [] && $entry === CommandEntry::Application => 'an application command needs no Entry',
            $authorizations === [] && $entries === [] => 'it declares neither Authorize nor a trusted Entry',
            default => null,
        };

        if ($fault !== null) {
            throw CommandDeclarationInvalid::for($command, $fault);
        }

        $authorize = $authorizations === [] ? null : $authorizations[0]->newInstance();

        return new self($command, $owner, $handler, $authorize, $entry);
    }

    public function needsRepeatableRead(): bool
    {
        return $this->reflection()->getAttributes(RepeatableRead::class) !== [];
    }

    public function effect(): CommandEffectType
    {
        foreach ($this->reflection()->getAttributes(Effect::class) as $declared) {
            return $declared->newInstance()->type;
        }

        return CommandEffectType::StateChange;
    }

    public function hasActorScopedReceipt(): bool
    {
        return $this->reflection()->getAttributes(RetainedActorRequestKey::class) !== [];
    }

    /**
     * Whether every call of the command must carry a request key: one that keeps its receipt, or its actor's.
     */
    public function isRequestKeyRequired(): bool
    {
        return $this->reflection()->getAttributes(RequiresRequestKey::class) !== [] || $this->hasActorScopedReceipt();
    }

    /**
     * The retention a command's RequiresRequestKey or RetainedActorRequestKey declares, or the standard one.
     *
     * @throws CommandDeclarationInvalid when it declares both
     */
    public function retention(): ReceiptRetention
    {
        $attribute = $this->reflection()->getAttributes(RequiresRequestKey::class)[0] ?? null;
        $retained = $this->reflection()->getAttributes(RetainedActorRequestKey::class)[0] ?? null;

        if ($attribute !== null && $retained !== null) {
            $conflictingAttributes = 'it declares both RequiresRequestKey and RetainedActorRequestKey';

            throw CommandDeclarationInvalid::for($this->command, $conflictingAttributes);
        }

        if ($retained !== null) {
            return ReceiptRetention::retainedForActor($this->command, $retained->newInstance());
        }

        return $attribute === null
            ? ReceiptRetention::standard()
            : ReceiptRetention::declaredBy($this->command, $attribute->newInstance());
    }

    /**
     * @return ReflectionClass<object>
     */
    public function reflection(): ReflectionClass
    {
        return new ReflectionClass($this->command);
    }
}
