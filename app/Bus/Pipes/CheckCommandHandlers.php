<?php

declare(strict_types=1);

namespace App\Bus\Pipes;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Contracts\RecordPolicy;
use App\Actors\Exceptions\GrantNotRegistered;
use App\Bus\Attributes\Authorize;
use App\Bus\Contracts\RecordCommand;
use App\Bus\Exceptions\CommandAuthorizationInvalid;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Exceptions\HandlerInOtherOwner;
use App\Bus\Support\CommandDeclarations;
use App\Bus\Support\DeclaredCommand;
use App\Bus\Support\SharedBindingCheck;
use App\Operations\Enums\AccessType;
use App\Pipelines\Contracts\Pipe;
use Illuminate\Auth\Access\Response;
use ReflectionClass;
use ReflectionMethod;
use ReflectionNamedType;
use ReflectionParameter;

/**
 * Checks every command's handler: a final class built fresh in its owner's Handlers folder, whose public handle takes
 * the command, and the record too for record work, and returns what the grammar allows; and checks that each
 * application command's grant fits its policy.
 */
final readonly class CheckCommandHandlers implements Pipe
{
    public function __construct(private PolicyCatalogue $policies) {}

    public function handle(CommandDeclarations $declarations): CommandDeclarations
    {
        foreach ($declarations->commands as $declared) {
            $this->check($declarations, $declared);
        }

        return $declarations;
    }

    private function check(CommandDeclarations $declarations, DeclaredCommand $declared): void
    {
        $command = $declared->command;
        $handler = $declared->handler;

        if (! $declared->owner->holdsIn('Handlers', $handler)) {
            throw HandlerInOtherOwner::for($command, $handler);
        }

        if (! class_exists($handler)) {
            throw CommandDeclarationInvalid::for($handler, 'the handler class does not exist');
        }

        $reflection = new ReflectionClass($handler);

        if (! $reflection->isFinal() || ! $reflection->isInstantiable()) {
            throw CommandDeclarationInvalid::for($handler, 'a handler is a final class that can be built');
        }

        SharedBindingCheck::check(
            $handler,
            static fn (string $problem) => CommandDeclarationInvalid::for($handler, $problem),
        );
        $handle = $reflection->hasMethod('handle') ? $reflection->getMethod('handle') : null;

        if ($handle === null || ! $handle->isPublic() || $handle->isStatic()) {
            throw CommandDeclarationInvalid::for($handler, 'it needs a public, non-static handle method');
        }

        $authorize = $declared->authorize;

        if ($authorize === null && ! self::takesOnly($handle, $command)) {
            throw CommandDeclarationInvalid::for(
                $handler,
                "handle takes exactly one required parameter, typed {$command}",
            );
        }

        if ($authorize !== null) {
            $this->checkAuthorization($command, $authorize, $handler, $handle);
        }

        $problem = $declarations->grammarFor($declared->owner)->problemWithResult($handle->getReturnType());

        if ($problem !== null) {
            throw CommandDeclarationInvalid::for($handler, "its result {$problem}");
        }
    }

    /**
     * The command, its policy and its handler must fit together: the pair is registered, a record policy goes with a
     * RecordCommand whose subject is the policy's model, and the handler takes the command, with the record too for
     * record work.
     *
     * @param  class-string  $command
     * @param  class-string  $handler
     *
     * @throws CommandAuthorizationInvalid
     */
    private function checkAuthorization(
        string $command,
        Authorize $authorize,
        string $handler,
        ReflectionMethod $handle,
    ): void {
        $policy = $authorize->policy;

        try {
            $this->policies->assertSupported($policy, $authorize->access);
        } catch (GrantNotRegistered $unsupported) {
            throw CommandAuthorizationInvalid::grantUnsupported($command, $unsupported);
        }

        $isRecordPolicy = is_subclass_of($policy, RecordPolicy::class);
        $isRecordCommand = is_subclass_of($command, RecordCommand::class);

        if ($isRecordPolicy && ! $isRecordCommand) {
            throw CommandAuthorizationInvalid::recordPolicyWithoutRecord($command, $policy);
        }

        if ($isRecordCommand && ! $isRecordPolicy) {
            throw CommandAuthorizationInvalid::recordWithoutRecordPolicy($command, $policy);
        }

        if (! $isRecordCommand) {
            if (! self::takesOnly($handle, $command)) {
                throw CommandAuthorizationInvalid::handlerShape($command, $handler, 'the command alone');
            }

            return;
        }

        $model = $policy::model();
        $subject = (string) new ReflectionMethod($command, 'subject')->getReturnType();

        if ($subject !== $model) {
            throw CommandAuthorizationInvalid::subjectMismatched($command, $subject, $model);
        }

        self::assertPermits($command, $policy, $model);
        $second = $handle->getParameters()[1] ?? null;
        $secondType = $second?->getType();
        $takesBoth = $handle->getNumberOfRequiredParameters() === 2 && self::takesFirst($handle, $command)
            && $secondType instanceof ReflectionNamedType && $secondType->getName() === $model;

        if (! $takesBoth) {
            throw CommandAuthorizationInvalid::handlerShape($command, $handler, "the command and {$model}");
        }
    }

    /**
     * A record policy decides through a public permits(Actor, its model, AccessType): Response.
     *
     * @param  class-string  $command
     * @param  class-string  $policy
     * @param  class-string  $model
     *
     * @throws CommandAuthorizationInvalid
     */
    private static function assertPermits(string $command, string $policy, string $model): void
    {
        $permits = method_exists($policy, 'permits') ? new ReflectionMethod($policy, 'permits') : null;
        $types = array_map(
            fn (ReflectionParameter $parameter) => (string) $parameter->getType(),
            $permits?->getParameters() ?? [],
        );
        $fits = $permits !== null && $permits->isPublic() && ! $permits->isStatic()
            && $types === [Actor::class, $model, AccessType::class]
            && (string) $permits->getReturnType() === Response::class;

        if (! $fits) {
            throw CommandAuthorizationInvalid::permitsMissing($command, $policy, $model);
        }
    }

    private static function takesFirst(ReflectionMethod $handle, string $command): bool
    {
        $type = ($handle->getParameters()[0] ?? null)?->getType();

        return $type instanceof ReflectionNamedType && $type->getName() === $command;
    }

    private static function takesOnly(ReflectionMethod $handle, string $command): bool
    {
        $parameter = $handle->getParameters()[0] ?? null;
        $type = $parameter?->getType();

        return $handle->getNumberOfRequiredParameters() === 1
            && $type instanceof ReflectionNamedType
            && $type->getName() === $command;
    }
}
