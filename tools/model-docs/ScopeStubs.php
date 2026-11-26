<?php

declare(strict_types=1);

namespace Tools\ModelDocs;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Files\Values\Depth;
use App\Support\DeclaredType;
use App\Support\ReflectedMethod;
use App\Support\ReflectedParameter;
use App\Support\Reflector;
use App\Values\FilePath;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Every model's query scopes as @method lines on each builder class the models query through, read from the models'
 * own code: a method marked #[Scope] keeps its name, a scopeName method is named without its prefix.
 */
final readonly class ScopeStubs
{
    private const string SCOPE_PREFIX = 'scope';

    private const array NOT_SCOPES = [
        'scope',
        'scopes',
        'scopeQuery',
    ];

    /**
     * @param  array<string, string>  $scopes  each scope's @method line, by name
     * @param  list<class-string>  $builders
     */
    private function __construct(private array $scopes, private array $builders) {}

    /**
     * @param  list<string>  $locations  the project folders that hold the models, a '*' matching within one name
     */
    public static function of(Files $files, array $locations): self
    {
        $scopes = [];
        $builders = [Builder::class];

        foreach (self::modelsIn($files, $locations) as $model) {
            $builders[] = $model->newInstanceWithoutConstructor()->newModelQuery()::class;

            foreach ($model->methods() as $method) {
                $name = self::scopeName($method);

                if ($name !== null) {
                    $scopes[$name] ??= self::methodLine($name, $method);
                }
            }
        }

        ksort($scopes);

        return new self($scopes, array_values(array_unique($builders)));
    }

    public function file(): string
    {
        $lines = implode("\n", array_map(fn (string $line) => "     * {$line}", $this->scopes));
        $blocks = array_map(fn (string $builder) => $this->block($builder, $lines), $this->builders);

        return "<?php\n\n// Written by tools/model-docs/scope-stubs.php for the IDE only; never loaded.\n\n"
            .implode("\n", $blocks);
    }

    public function scopeCount(): int
    {
        return count($this->scopes);
    }

    public function builderCount(): int
    {
        return count($this->builders);
    }

    /**
     * @param  class-string  $builder
     */
    private function block(string $builder, string $lines): string
    {
        $type = Reflector::of($builder);

        return "namespace {$type->namespaceName()} {\n    /**\n{$lines}\n     */\n"
            ."    class {$type->shortName()} {}\n}\n";
    }

    /**
     * @param  list<string>  $locations
     * @return list<Reflector<Model>>
     */
    private static function modelsIn(Files $files, array $locations): array
    {
        $models = [];

        foreach ($locations as $location) {
            foreach ($files->matching(FilePath::in(Place::Project, $location)) as $folder) {
                foreach ($files->list($folder->path, Depth::levels(Depth::LEVEL_LIMIT), '*.php') as $file) {
                    $class = $file->isFile() ? self::classIn($files->codeFile($file->path)) : null;
                    $type = $class !== null && Reflector::exists($class) ? Reflector::of($class) : null;

                    if ($type !== null && $type->isSubclassOf(Model::class) && ! $type->isAbstract()) {
                        $models[] = $type;
                    }
                }
            }
        }

        return $models;
    }

    private static function classIn(string $code): string|null
    {

        if (preg_match('/^namespace ([^;]+);/m', $code, $namespace) !== 1
            || preg_match('/^(?:final |abstract |readonly )*class (\w+)/m', $code, $class) !== 1) {
            return null;
        }

        return "{$namespace[1]}\\{$class[1]}";
    }

    private static function scopeName(ReflectedMethod $method): string|null
    {
        if ($method->hasAttribute(Scope::class)) {
            return $method->name();
        }

        $name = $method->name();

        if (! str_starts_with($name, self::SCOPE_PREFIX) || in_array($name, self::NOT_SCOPES, true)) {
            return null;
        }

        return lcfirst(substr($name, strlen(self::SCOPE_PREFIX)));
    }

    private static function methodLine(string $name, ReflectedMethod $method): string
    {
        $parameters = array_slice($method->parameters(), 1);

        return "@method \$this {$name}(".implode(', ', array_map(self::parameter(...), $parameters)).')';
    }

    private static function parameter(ReflectedParameter $parameter): string
    {
        $type = $parameter->type()->map(fn (DeclaredType $declared) => self::typeName($declared, $parameter))
            ->getOrElse('');
        $variadic = $parameter->isVariadic() ? '...' : '';
        $default = $parameter->hasDefaultValue() ? ' = '.var_export($parameter->defaultValue(), true) : '';

        return trim("{$type} {$variadic}\${$parameter->name()}{$default}");
    }

    /**
     * The type as a docblock writes it from any namespace: a class fully qualified, a type made of several as mixed.
     */
    private static function typeName(DeclaredType $type, ReflectedParameter $parameter): string
    {
        if (! $type->isNamed()) {
            return 'mixed';
        }

        $name = $type->isBuiltin() ? $type->name() : '\\'.$type->className();

        if ($parameter->allowsNull() && ! in_array($name, ['mixed', 'null'], true)) {
            return "{$name}|null";
        }

        return $name;
    }
}
