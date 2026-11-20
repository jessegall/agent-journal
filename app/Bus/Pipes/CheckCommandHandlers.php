<?php

declare(strict_types=1);

namespace App\Bus\Pipes;

use App\Actors\Contracts\Policy;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Contracts\ClassLevelAbilities;
use App\Bus\Enums\CommandEntry;
use App\Bus\Exceptions\CommandAuthorizationInvalid;
use App\Bus\Exceptions\CommandAuthorizationMissing;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Exceptions\HandlerInOtherOwner;
use App\Bus\Support\CommandAuthorization;
use App\Bus\Support\CommandDeclarations;
use App\Bus\Support\DeclaredCommand;
use App\Bus\Support\SharedBindingCheck;
use App\Pipelines\Contracts\Pipe;
use ReflectionClass;
use ReflectionMethod;
use ReflectionNamedType;

/**
 * Checks every command's handler: a final class built fresh in its owner's Handlers folder, whose public handle takes
 * the command, and the subject too when the command declares its authorization, and returns what the grammar allows.
 * An application command must declare its authorization.
 */
final readonly class CheckCommandHandlers implements Pipe
{
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

        $authorization = $declared->authorization();

        if ($authorization === null && ! self::takesOnly($handle, $command)) {
            throw CommandDeclarationInvalid::for(
                $handler,
                "handle takes exactly one required parameter, typed {$command}",
            );
        }

        if ($authorization !== null) {
            self::checkAuthorization($command, $authorization, $handler, $handle);
        }

        $problem = $declarations->grammarFor($declared->owner)->problemWithResult($handle->getReturnType());

        if ($problem !== null) {
            throw CommandDeclarationInvalid::for($handler, "its result {$problem}");
        }

        if ($authorization === null && $declared->entry() === CommandEntry::Application) {
            throw CommandAuthorizationMissing::for($command);
        }
    }

    /**
     * The command, its policy, its subject and its handler must fit together: the subject's type is what the policy's
     * authorize takes, the ability is a case of its enum, a class subject pairs only with a class-level ability, and
     * the handler takes the command and the subject.
     *
     * @param  class-string  $command
     * @param  class-string  $handler
     *
     * @throws CommandAuthorizationInvalid
     */
    private static function checkAuthorization(
        string $command,
        CommandAuthorization $authorization,
        string $handler,
        ReflectionMethod $handle,
    ): void {
        if (! is_subclass_of($command, AuthorizedCommand::class)) {
            throw CommandAuthorizationInvalid::subjectMissing($command);
        }

        $policy = $authorization->policy;
        $authorize = is_subclass_of($policy, Policy::class) && method_exists($policy, 'authorize')
            ? new ReflectionMethod($policy, 'authorize')
            : null;
        $parameters = $authorize?->getParameters() ?? [];

        if ($authorize === null || ! $authorize->isPublic() || count($parameters) !== 3) {
            throw CommandAuthorizationInvalid::policyInvalid($command, $policy);
        }

        $subject = (string) new ReflectionMethod($command, 'subject')->getReturnType();
        $accepted = (string) $parameters[1]->getType();

        if (! self::typeFits($subject, $accepted)) {
            throw CommandAuthorizationInvalid::subjectMismatched($command, $subject, $accepted);
        }

        $abilityType = (string) $parameters[2]->getType();
        $ability = $authorization->ability;

        if (! $ability instanceof $abilityType) {
            throw CommandAuthorizationInvalid::abilityMismatched($command, $ability::class, $abilityType);
        }

        $classLevel = $ability instanceof ClassLevelAbilities && $ability->isClassLevel();

        if ($subject === 'string' && ! $classLevel) {
            throw CommandAuthorizationInvalid::classSubjectOnInstanceAbility($command, $ability::class);
        }

        $classSubjectFits = $subject === 'string' && self::takesOnly($handle, $command);

        if ($classSubjectFits) {
            return;
        }

        $second = $handle->getParameters()[1] ?? null;
        $takesBoth = $handle->getNumberOfRequiredParameters() === 2 && self::takesFirst($handle, $command);

        if (! $takesBoth || $second === null || ! self::typeFits($subject, (string) $second->getType())) {
            throw CommandAuthorizationInvalid::handlerShape($command, $handler, $subject);
        }
    }

    /**
     * Whether a value of the given type is accepted by a parameter of the other, a union or a parent included.
     */
    private static function typeFits(string $given, string $accepted): bool
    {
        foreach (explode('|', $accepted) as $type) {
            $anyObject = $type === 'object' && class_exists($given);

            if ($type === $given || $anyObject || (class_exists($given) && is_a($given, $type, true))) {
                return true;
            }
        }

        return false;
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
