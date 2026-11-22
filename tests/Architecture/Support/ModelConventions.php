<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\ReadableModel;
use App\Support\Reflector;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Tests\Support\ScanCache\ScanCache;

/**
 * Rule 6 for every model of a domain: an explicit #[Fillable] list, nothing else, and never an open model.
 */
final class ModelConventions
{
    /**
     * Calls that open a model to mass assignment in vendor code the name scan never reads.
     */
    private const array OPENING_CALLS = [
        'unguard',
        'unguarded',
        'mergefillable',
        'fillable',
        'guard',
        'forcefill',
        'forcecreate',
    ];

    /**
     * @param  list<string>  $files
     * @return list<Violation>
     */
    public static function modelViolations(array $files): array
    {
        $violations = [];

        foreach (self::modelsIn($files) as $path => $classes) {
            foreach ($classes as $line => $class) {
                array_push($violations, ...self::violationsOf($path, $line, $class));
            }
        }

        return $violations;
    }

    /**
     * @param  list<string>  $files
     * @return list<Violation>
     */
    public static function openingCalls(array $files): array
    {
        $violations = [];

        foreach (ScanCache::findingsByFile(new CallScan(), $files) as $path => $calls) {
            foreach ($calls as $call) {
                if (in_array(strtolower($call['method']), self::OPENING_CALLS, true)) {
                    $violations[] = new Violation(
                        $path,
                        $call['line'],
                        $call['method'].'()',
                        'none',
                        'none',
                        ViolationType::OpeningModelCall,
                    );
                }
            }
        }

        return $violations;
    }

    /**
     * Every model is keyed by a ULID through HasUlids and can be linked through Linkable (rule 29).
     *
     * @param  list<string>  $files
     * @return list<Violation>
     */
    public static function identityViolations(array $files): array
    {
        $violations = [];

        foreach (self::modelsIn($files) as $path => $models) {
            foreach ($models as $line => $class) {
                $traits = class_uses_recursive($class);

                if (! in_array(HasUlids::class, $traits, true) || new $class()->getKeyType() !== 'string') {
                    $violations[] = new Violation($path, $line, $class, 'none', 'none', ViolationType::KeyNotUlid);
                }

                if (! in_array(Linkable::class, $traits, true)) {
                    $violations[] = new Violation(
                        $path,
                        $line,
                        $class,
                        'none',
                        'none',
                        ViolationType::ModelNotLinkable,
                    );
                }
            }
        }

        return $violations;
    }

    /**
     * Every model bounds its reads: it implements ReadableModel and uses BoundedReads.
     *
     * @param  list<string>  $files
     * @return list<Violation>
     */
    public static function readPolicyViolations(array $files): array
    {
        $violations = [];

        foreach (self::modelsIn($files) as $path => $models) {
            foreach ($models as $line => $class) {
                if (! Reflector::of($class)->isSubclassOf(ReadableModel::class)
                    || ! in_array(BoundedReads::class, class_uses_recursive($class), true)) {
                    $violations[] = new Violation(
                        $path,
                        $line,
                        $class,
                        'none',
                        'none',
                        ViolationType::ModelReadsUnbounded,
                    );
                }
            }
        }

        return $violations;
    }

    /**
     * @param  class-string<Model>  $class
     * @return list<Violation>
     */
    private static function violationsOf(string $path, int $line, string $class): array
    {
        $model = new $class();
        $violations = [];

        if (! self::listsFillableOnlyInTheAttribute($class, $model)) {
            $violations[] = new Violation($path, $line, $class, 'none', 'none', ViolationType::FillableNotListed);
        }

        if ($model->getGuarded() === []) {
            $violations[] = new Violation($path, $line, $class, 'none', 'none', ViolationType::OpenModel);
        }

        return $violations;
    }

    /**
     * Every concrete model class declared in the files, by file and line.
     *
     * @param  list<string>  $files
     * @return array<string, array<int, class-string<Model>>>
     */
    private static function modelsIn(array $files): array
    {
        $models = [];

        foreach (ScanCache::findingsByFile(new ClassesDeclared(), $files) as $path => $classes) {
            foreach ($classes as $name) {
                if (! Reflector::factory()->isSubclassOf($name, Model::class)) {
                    continue;
                }

                $model = Reflector::of($name);

                if ($model->not()->isAbstract()) {
                    $models[$path][$model->startLine()] = $name;
                }
            }
        }

        return $models;
    }

    /**
     * Rule 6: the model's fillable columns come from a non-empty #[Fillable] attribute alone, as Laravel reads them.
     *
     * @param  class-string<Model>  $class
     */
    private static function listsFillableOnlyInTheAttribute(string $class, Model $model): bool
    {
        $columns = self::fillableAttributeColumns($class);

        return $columns !== [] && $columns === $model->getFillable() && ! self::declaresFillableProperty($class);
    }

    /**
     * The columns of the #[Fillable] attribute on the model or the nearest parent that carries one; none without one.
     *
     * @param  class-string<Model>  $class
     * @return list<string>
     */
    private static function fillableAttributeColumns(string $class): array
    {
        foreach (Reflector::of($class)->lineage() as $declaration) {
            if ($declaration->hasAttribute(Fillable::class)) {
                return array_values($declaration->attribute(Fillable::class)->columns);
            }
        }

        return [];
    }

    /**
     * Whether the model or a parent writes a non-empty $fillable property beside or instead of the attribute.
     *
     * @param  class-string<Model>  $class
     */
    private static function declaresFillableProperty(string $class): bool
    {
        return Reflector::of($class)->property('fillable')->defaultValue() !== [];
    }
}
