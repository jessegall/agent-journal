<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Enums\CommandEntry;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use ReflectionClass;

/**
 * One command an owner lists, with the handler its HandledBy names, and what its attributes declare.
 */
final readonly class DeclaredCommand
{
    /**
     * @param  class-string  $command
     * @param  class-string  $handler
     */
    public function __construct(
        public string $command,
        public CommandOwner $owner,
        public string $handler,
    ) {}

    /**
     * The trusted entry the command declares; a command without Entry is an application command.
     */
    public function entry(): CommandEntry
    {
        foreach ($this->reflection()->getAttributes(Entry::class) as $declared) {
            return $declared->newInstance()->entry;
        }

        return CommandEntry::Application;
    }

    public function authorization(): CommandAuthorization|null
    {
        $declared = $this->reflection()->getAttributes(Authorize::class)[0] ?? null;

        if ($declared === null) {
            return null;
        }

        $authorize = $declared->newInstance();

        return new CommandAuthorization($authorize->policy, $authorize->ability);
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

    public function operation(): Operation|null
    {
        foreach ($this->reflection()->getAttributes(Operation::class) as $declared) {
            $operation = $declared->newInstance();

            if ($operation->name === '') {
                throw CommandDeclarationInvalid::for($this->command, 'its Operation needs a name');
            }

            return $operation;
        }

        if ($this->owner->exportsCommand($this->command) && $this->entry() === CommandEntry::Application) {
            throw CommandDeclarationInvalid::for($this->command, 'an exported application command needs Operation');
        }

        return null;
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
