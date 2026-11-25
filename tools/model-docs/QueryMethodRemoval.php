<?php

declare(strict_types=1);

namespace Tools\ModelDocs;

use App\Support\ReflectedMethod;
use App\Support\ReflectedType;
use Barryvdh\LaravelIdeHelper\Console\ModelsCommand;
use Barryvdh\LaravelIdeHelper\Contracts\ModelHookInterface;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Model;

/**
 * Leaves a model's query and scope methods out of the doc block written into the model: IDE Helper types them as a
 * builder or the model, which hides the builder Larastan reads from the code. The IDE-only helper file keeps them.
 */
final class QueryMethodRemoval implements ModelHookInterface
{
    private const array QUERY_METHODS = [
        'newModelQuery',
        'newQuery',
        'query',
    ];

    private const string SCOPE_PREFIX = 'scope';

    public function run(ModelsCommand $command, Model $model): void
    {
        if (! $command->option('write')) {
            return;
        }

        collect(ReflectedType::of($model)->methods())
            ->filter(fn (ReflectedMethod $method) => $this->isScope($method))
            ->map(fn (ReflectedMethod $method) => $this->scopeName($method))
            ->merge(self::QUERY_METHODS)
            ->each(fn (string $name) => $command->unsetMethod($name));
    }

    private function isScope(ReflectedMethod $method): bool
    {
        return $method->hasAttribute(Scope::class) || str_starts_with($method->name(), self::SCOPE_PREFIX);
    }

    private function scopeName(ReflectedMethod $method): string
    {
        if ($method->hasAttribute(Scope::class)) {
            return $method->name();
        }

        return lcfirst(substr($method->name(), strlen(self::SCOPE_PREFIX)));
    }
}
