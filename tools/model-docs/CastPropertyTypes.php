<?php

declare(strict_types=1);

namespace Tools\ModelDocs;

use App\Support\ReflectedType;
use Barryvdh\LaravelIdeHelper\Console\ModelsCommand;
use Barryvdh\LaravelIdeHelper\Contracts\ModelHookInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use PHPStan\PhpDocParser\Ast\PhpDoc\PhpDocTagNode;
use PHPStan\PhpDocParser\Lexer\Lexer;
use PHPStan\PhpDocParser\Parser\ConstExprParser;
use PHPStan\PhpDocParser\Parser\PhpDocParser;
use PHPStan\PhpDocParser\Parser\TokenIterator;
use PHPStan\PhpDocParser\Parser\TypeParser;
use PHPStan\PhpDocParser\ParserConfig;
use Spatie\LaravelData\Contracts\BaseData;
use Spatie\LaravelData\DataCollection;

/**
 * Types each property whose cast IDE Helper reads too loosely or not at all: a cast with no column, an alias the
 * model's queries select, as a read-only property; a Spatie Data cast as its Data class or a collection of it; and an
 * array column as the type its "@column <name> <type>" line in the casts() doc comment states.
 */
final class CastPropertyTypes implements ModelHookInterface
{
    private const string COLLECTION_PREFIX = DataCollection::class.':';

    public function run(ModelsCommand $command, Model $model): void
    {
        $columns = collect($model->getConnection()->getSchemaBuilder()->getColumns($model->getTable()));
        $nullableColumns = $columns->filter(fn (array $column): bool => $column['nullable'])->pluck('name');

        collect($model->getCasts())
            ->keys()
            ->diff($columns->pluck('name'))
            ->each(fn (string $alias) => $command->setProperty($alias, null, true, false));
        $command->castPropertiesType($model);

        collect($model->getCasts())
            ->filter(fn (string $cast): bool => $this->isDataCast($cast))
            ->map(fn (string $cast): string => $this->dataType($cast))
            ->merge($this->statedColumnTypes($model))
            ->each(fn (string $type, string $column) => $command->setProperty(
                $column,
                $type,
                true,
                true,
                '',
                $nullableColumns->contains($column) && ! str_ends_with($type, '|null'),
            ));
    }

    private function isDataCast(string $cast): bool
    {
        return $this->isDataCollectionCast($cast) || ReflectedType::find($cast)
            ->map(fn (ReflectedType $type): bool => $type->implements(BaseData::class))
            ->getOrElse(false);
    }

    private function isDataCollectionCast(string $cast): bool
    {
        return str_starts_with($cast, self::COLLECTION_PREFIX);
    }

    private function dataType(string $cast): string
    {
        if ($this->isDataCollectionCast($cast)) {
            return '\\'.DataCollection::class.'<int, \\'.substr($cast, strlen(self::COLLECTION_PREFIX)).'>';
        }

        return '\\'.$cast;
    }

    /**
     * The type of each array column the casts() doc comment states, keyed by column.
     *
     * @return Collection<string, string>
     */
    private function statedColumnTypes(Model $model): Collection
    {
        return ReflectedType::of($model)
            ->method('casts')
            ->docComment()
            ->map(fn (string $comment): Collection => $this->columnTags($comment))
            ->getOrElse(collect());
    }

    /**
     * @return Collection<string, string>
     */
    private function columnTags(string $comment): Collection
    {
        $config = new ParserConfig([]);
        $expressions = new ConstExprParser($config);
        $docParser = new PhpDocParser($config, new TypeParser($config, $expressions), $expressions);
        $tags = $docParser->parse(new TokenIterator(new Lexer($config)->tokenize($comment)))->getTagsByName('@column');

        return collect($tags)
            ->map(fn (PhpDocTagNode $tag): array => explode(' ', (string) $tag->value, 2))
            ->mapWithKeys(fn (array $columnAndType): array => [$columnAndType[0] => $columnAndType[1]]);
    }
}
