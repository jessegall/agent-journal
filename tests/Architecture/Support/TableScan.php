<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Illuminate\Support\Str;
use PhpParser\Node\Arg;
use PhpParser\Node\Expr;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Identifier;
use PhpParser\Node\Name;
use PhpParser\Node\Scalar\String_;
use PhpParser\NodeFinder;
use PhpParser\PrettyPrinter\Standard;
use Tests\Support\ScanCache\FileScan;

/**
 * Every table a file names, knowing per Laravel method which argument is a table, a subquery or an alias.
 *
 * @implements FileScan<TableUse>
 */
final readonly class TableScan implements FileScan
{
    public function key(): string
    {
        return 'table-uses-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return self::of($file);
    }

    private const string DB = 'Illuminate\\Support\\Facades\\DB';

    private const string SCHEMA = 'Illuminate\\Support\\Facades\\Schema';

    private const array QUERY_TABLE_METHODS = ['from', 'join', 'leftJoin', 'rightJoin', 'crossJoin'];

    private const array SCHEMA_TYPES = [
        'create' => TableType::Create,
        'hasTable' => TableType::Read,
        'table' => TableType::Change,
        'drop' => TableType::Change,
        'dropIfExists' => TableType::Change,
    ];

    /**
     * The argument that names the pivot table of each relation that has one.
     */
    private const array PIVOT_ARGUMENTS = ['belongsToMany' => 1, 'morphToMany' => 2, 'morphedByMany' => 2];

    /**
     * @return list<TableUse>
     */
    public static function of(ParsedFile $file): array
    {
        $uses = [];
        $finder = new NodeFinder();

        foreach ($finder->findInstanceOf($file->statements, StaticCall::class) as $call) {
            array_push($uses, ...self::facadeUses($file, $call));
        }

        foreach ($finder->findInstanceOf($file->statements, MethodCall::class) as $call) {
            array_push($uses, ...self::methodUses($file, $call));
        }

        return $uses;
    }

    /**
     * @return list<TableUse>
     */
    private static function facadeUses(ParsedFile $file, StaticCall $call): array
    {
        if (! $call->class instanceof Name || ! $call->name instanceof Identifier) {
            return [];
        }

        $facade = $call->class->toString();
        $method = $call->name->toString();

        if ($facade === self::DB && $method === 'table') {
            return self::tableArgument($file, $call, 0, TableType::Read);
        }

        if ($facade === self::SCHEMA && $method === 'rename') {
            return [
                ...self::tableArgument($file, $call, 0, TableType::Change),
                ...self::tableArgument($file, $call, 1, TableType::Create),
            ];
        }

        if ($facade === self::SCHEMA && isset(self::SCHEMA_TYPES[$method])) {
            return self::tableArgument($file, $call, 0, self::SCHEMA_TYPES[$method]);
        }

        return [];
    }

    /**
     * @return list<TableUse>
     */
    private static function methodUses(ParsedFile $file, MethodCall $call): array
    {
        if (! $call->name instanceof Identifier) {
            return [];
        }

        $method = $call->name->toString();

        return match (true) {
            in_array($method, self::QUERY_TABLE_METHODS, true) => self::queryTable($file, $call),
            $method === 'setTable' => self::tableArgument($file, $call, 0, TableType::ModelTable),
            $method === 'constrained' => self::constrainedTable($file, $call),
            $method === 'on' && self::followsReferences($call) => self::tableArgument(
                $file,
                $call,
                0,
                TableType::ForeignKey,
            ),
            isset(self::PIVOT_ARGUMENTS[$method]) => self::pivotTable($file, $call, self::PIVOT_ARGUMENTS[$method]),
            default => [],
        };
    }

    /**
     * A closure or a query builder given to from or join is a subquery; its own table calls are found where they are
     * written.
     *
     * @return list<TableUse>
     */
    private static function queryTable(ParsedFile $file, MethodCall $call): array
    {
        $table = self::argument($call, 0);

        if ($table instanceof Expr\Closure
            || $table instanceof Expr\ArrowFunction
            || $table instanceof MethodCall
            || $table instanceof StaticCall) {
            return [];
        }

        if ($table instanceof String_ && ! self::looksLikeTable($table->value)) {
            return [];
        }

        return self::tableArgument($file, $call, 0, TableType::Read);
    }

    /**
     * constrained() with no table names the one Laravel infers from the column: task_id gives tasks.
     *
     * @return list<TableUse>
     */
    private static function constrainedTable(ParsedFile $file, MethodCall $call): array
    {
        if (self::argument($call, 0) !== null) {
            return self::tableArgument($file, $call, 0, TableType::ForeignKey);
        }

        $column = $call->var instanceof MethodCall ? self::argument($call->var, 0) : null;

        if (! $column instanceof String_) {
            return [new TableUse($file->path, $call->getStartLine(), self::code($call), TableType::NotWritten)];
        }

        $table = Str::of($column->value)->beforeLast('_id')->plural()->toString();

        return [new TableUse($file->path, $call->getStartLine(), $table, TableType::ForeignKey)];
    }

    /**
     * @return list<TableUse>
     */
    private static function pivotTable(ParsedFile $file, MethodCall $call, int $position): array
    {
        if (self::argument($call, $position) === null) {
            return [new TableUse($file->path, $call->getStartLine(), self::code($call), TableType::PivotNotWritten)];
        }

        return self::tableArgument($file, $call, $position, TableType::Pivot);
    }

    /**
     * @return list<TableUse>
     */
    private static function tableArgument(
        ParsedFile $file,
        MethodCall|StaticCall $call,
        int $position,
        TableType $type,
    ): array {
        $table = self::argument($call, $position);

        if ($table === null) {
            return [];
        }

        if (! $table instanceof String_) {
            return [new TableUse($file->path, $call->getStartLine(), self::code($table), TableType::NotWritten)];
        }

        return [new TableUse($file->path, $call->getStartLine(), self::withoutAlias($table->value), $type)];
    }

    private static function argument(MethodCall|StaticCall $call, int $position): Expr|null
    {
        $argument = $call->args[$position] ?? null;

        return $argument instanceof Arg ? $argument->value : null;
    }

    private static function followsReferences(MethodCall $call): bool
    {
        return $call->var instanceof MethodCall
            && $call->var->name instanceof Identifier
            && $call->var->name->toString() === 'references';
    }

    /**
     * A table name, with or without an alias; a glue string such as ', ' given to a collection's join is no table.
     */
    private static function looksLikeTable(string $value): bool
    {
        return preg_match('/^[a-z_][a-z0-9_]*(\s+as\s+\w+)?$/i', $value) === 1;
    }

    private static function withoutAlias(string $table): string
    {
        return Str::of($table)->replaceMatches('/\s+as\s+\w+$/i', '')->trim()->toString();
    }

    private static function code(Expr $expression): string
    {
        return new Standard()->prettyPrintExpr($expression);
    }
}
