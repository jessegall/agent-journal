<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Attributes\Authorize;
use App\Contracts\Actor;
use App\Contracts\Pipe;
use App\Contracts\PolicyCatalogue;
use App\Contracts\RecordCommand;
use App\Contracts\RecordPolicy;
use App\Contracts\ReflectorFactory;
use App\Enums\AccessType;
use App\Exceptions\CommandAuthorizationInvalid;
use App\Exceptions\CommandDeclarationInvalid;
use App\Exceptions\GrantNotRegistered;
use App\Support\CommandDeclarations;
use App\Support\DeclaredCommand;
use App\Support\DeclaredType;
use App\Support\ReflectedMethod;
use App\Support\ReflectedParameter;
use App\Support\Reflector;
use App\Support\SharedBindingCheck;
use Illuminate\Auth\Access\Response;
use PhpOption\Option;

/**
 * Checks every command's handler: a final class built fresh beside its command, whose public handle takes
 * the command, and the record too for record work, and returns what the grammar allows; and checks that each
 * application command's grant fits its policy.
 */
final readonly class CheckCommandHandlers implements Pipe
{
    public function __construct(private PolicyCatalogue $policies, private ReflectorFactory $reflectors) {}

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

        $declaration = $this->reflectors->make($handler);

        if (! $declaration->isFinal() || ! $declaration->isInstantiable()) {
            throw CommandDeclarationInvalid::for($handler, 'a handler is a final class that can be built');
        }

        SharedBindingCheck::check(
            $handler,
            static fn (string $problem) => CommandDeclarationInvalid::for($handler, $problem),
        );

        if (! $declaration->hasMethod('handle')
            || ! $declaration->method('handle')->isPublic()
            || $declaration->method('handle')->isStatic()) {
            throw CommandDeclarationInvalid::for($handler, 'it needs a public, non-static handle method');
        }

        $handle = $declaration->method('handle');

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

        $problem = $declarations->grammarFor($declared->owner)->problemWithResult($handle);

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
        ReflectedMethod $handle,
    ): void {
        $policy = $authorize->policy;

        try {
            $this->policies->assertSupported($policy, $authorize->access);
        } catch (GrantNotRegistered $unsupported) {
            throw CommandAuthorizationInvalid::grantUnsupported($command, $unsupported);
        }

        $isRecordPolicy = $this->reflectors->make($policy)->isSubclassOf(RecordPolicy::class);
        $isRecordCommand = $this->reflectors->make($command)->isSubclassOf(RecordCommand::class);

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
        $subject = self::textOf($this->reflectors->make($command)->method('subject')->returnType());

        if ($subject !== $model) {
            throw CommandAuthorizationInvalid::subjectMismatched($command, $subject, $model);
        }

        self::assertPermits($command, $policy, $model);

        $takesBoth = $handle->requiredParameterCount() === 2
            && self::takesAt($handle, 0, $command)
            && self::takesAt($handle, 1, $model);

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
        $declaration = Reflector::of($policy);

        if (! $declaration->hasMethod('permits')) {
            throw CommandAuthorizationInvalid::permitsMissing($command, $policy, $model);
        }

        $permits = $declaration->method('permits');

        $types = array_map(
            fn (ReflectedParameter $parameter) => self::textOf($parameter->type()),
            $permits->parameters(),
        );

        $fits = $permits->isPublic() && ! $permits->isStatic()
            && $types === [Actor::class, $model, AccessType::class]
            && self::textOf($permits->returnType()) === Response::class;

        if (! $fits) {
            throw CommandAuthorizationInvalid::permitsMissing($command, $policy, $model);
        }
    }

    /**
     * Whether the method's parameter at this position is declared as exactly this one named type.
     */
    private static function takesAt(ReflectedMethod $handle, int $position, string $type): bool
    {
        $parameters = $handle->parameters();

        return isset($parameters[$position]) && $parameters[$position]->type()
            ->filter(fn (DeclaredType $declared) => $declared->isNamedAs($type))
            ->isDefined();
    }

    private static function takesOnly(ReflectedMethod $handle, string $command): bool
    {
        return $handle->requiredParameterCount() === 1 && self::takesAt($handle, 0, $command);
    }

    /**
     * A declared type as PHP writes it; empty when none is declared.
     *
     * @param  Option<DeclaredType>  $type
     */
    private static function textOf(Option $type): string
    {
        return $type->map(fn (DeclaredType $declared) => $declared->text)->getOrElse('');
    }
}
