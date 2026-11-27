<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\CommandCall;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Exceptions\CommandInputInvalid;
use App\Support\CommandRegistry;
use Closure;
use Illuminate\Contracts\Validation\Factory;

/**
 * Before any lock, transaction or receipt, a command's input passes the rules its properties declare; a command
 * that declares none passes without a validator. A null optional field counts as not sent.
 */
final readonly class ValidateCommand implements CommandMiddleware
{
    public function __construct(private CommandRegistry $registry, private Factory $validation) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $rules = $this->registry->rulesFor($call->name());

        if ($rules === []) {
            return $next($call);
        }

        $validator = $this->validation->make($this->sentValues($call->command(), $rules), $rules);

        if ($validator->fails()) {
            throw CommandInputInvalid::from($validator);
        }

        return $next($call);
    }

    /**
     * The values of the ruled properties, leaving out each one that is null as a field that was not sent.
     *
     * @param  Command<mixed>  $command
     * @param  array<string, list<string|object>>  $rules
     * @return array<string, mixed>
     */
    private function sentValues(Command $command, array $rules): array
    {
        return array_filter(
            array_intersect_key(get_object_vars($command), $rules),
            static fn (mixed $commandField) => $commandField !== null,
        );
    }
}
