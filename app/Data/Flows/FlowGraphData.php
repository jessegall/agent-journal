<?php

declare(strict_types=1);

namespace App\Data\Flows;

use App\Enums\Profiles\FlowNodeType;
use App\Values\CompiledScript;
use App\Values\Instruction;
use App\Values\TriggerPolicy;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The flowchart of a compiled script, one graph for the chart and the Mermaid export alike: a node for each trigger,
 * instruction, policy step and terminal, an edge for each port, and a rank and order for each node. Pending and
 * uncertain are not ports, so the graph has no retry loop.
 */
#[TypeScript]
final class FlowGraphData extends Data
{
    /**
     * The characters a Mermaid label would read as markup, and the entities that show them as text.
     */
    private const array MERMAID_ESCAPES = [
        '"' => '#quot;',
        '|' => '#124;',
        '<' => '#lt;',
        '>' => '#gt;',
        '[' => '#91;',
        ']' => '#93;',
    ];

    /**
     * @param  list<FlowNodeData>  $nodes
     * @param  list<FlowEdgeData>  $edges
     */
    public function __construct(
        #[DataCollectionOf(FlowNodeData::class)]
        public readonly array $nodes,
        #[DataCollectionOf(FlowEdgeData::class)]
        public readonly array $edges,
        public readonly string $mermaid,
    ) {}

    public static function fromCompiled(CompiledScript $compiled): self
    {
        $nodes = [];
        $edges = [];

        /**
         * @var array<string, array{entry: string, policy: TriggerPolicy}> $handlers
         */
        $handlers = $compiled->graph['handlers'];

        foreach ($handlers as $trigger => $handler) {
            $nodes[$trigger] = new FlowNodeData($trigger, "ON {$trigger}", FlowNodeType::Trigger, null);
            $edges[] = new FlowEdgeData($trigger, $handler['entry'], 'start');
            $fallthrough = $handler['policy']->fallthrough;
            $returnToActor = $handler['policy']->returnToActor;
            $nodes[$fallthrough] = new FlowNodeData($fallthrough, 'final checks', FlowNodeType::Policy, null);
            $nodes[$returnToActor] = new FlowNodeData($returnToActor, 'return policy', FlowNodeType::Policy, null);
            $nodes['certified'] = new FlowNodeData('certified', 'certified', FlowNodeType::Terminal, null);

            $nodes['return-to-actor'] = new FlowNodeData(
                'return-to-actor',
                'return to actor',
                FlowNodeType::Terminal,
                null,
            );

            $nodes['held'] = new FlowNodeData('held', 'held', FlowNodeType::Terminal, null);

            array_push(
                $edges,
                new FlowEdgeData($fallthrough, 'certified', 'passed'),
                new FlowEdgeData($fallthrough, $returnToActor, 'failure'),
                new FlowEdgeData($returnToActor, 'return-to-actor', 'returned'),
                new FlowEdgeData($returnToActor, 'held', 'unchanged three times'),
            );
        }

        /**
         * @var array<string, Instruction> $instructions
         */
        $instructions = $compiled->graph['instructions'];

        foreach ($instructions as $id => $instruction) {
            $nodes[$id] = new FlowNodeData(
                $id,
                $instruction->label(),
                FlowNodeType::Instruction,
                $instruction->source->line,
            );

            foreach ($instruction->successors as $port => $next) {
                $edges[] = new FlowEdgeData($id, $next, $port);
                $nodes[$next] ??= new FlowNodeData($next, $next, FlowNodeType::Terminal, null);
            }
        }

        $placed = self::placed($nodes, $edges);

        return new self($placed, $edges, self::mermaid($placed, $edges));
    }

    /**
     * Ranks each node by its longest path from a trigger, the graph being acyclic, and orders each rank by the
     * source line, then by key.
     *
     * @param  array<string, FlowNodeData>  $nodes
     * @param  list<FlowEdgeData>  $edges
     * @return list<FlowNodeData>
     */
    private static function placed(array $nodes, array $edges): array
    {
        $ranks = array_map(fn () => 0, $nodes);

        foreach (array_keys($nodes) as $pass) {
            foreach ($edges as $edge) {
                $ranks[$edge->to] = max($ranks[$edge->to], $ranks[$edge->from] + 1);
            }
        }

        $placed = [];

        foreach (array_keys(array_count_values($ranks)) as $rank) {
            $inRank = array_values(array_filter($nodes, fn (FlowNodeData $node) => $ranks[$node->id] === $rank));

            usort($inRank, fn (FlowNodeData $first, FlowNodeData $second) => [
                $first->line ?? PHP_INT_MAX,
                $first->id,
            ]
                <=> [
                    $second->line ?? PHP_INT_MAX,
                    $second->id,
                ]);

            foreach ($inRank as $order => $node) {
                $placed[] = $node->placedAt($rank, $order);
            }
        }

        usort($placed, fn (FlowNodeData $first, FlowNodeData $second) => [
            $first->rank,
            $first->order,
        ]
            <=> [
                $second->rank,
                $second->order,
            ]);

        return $placed;
    }

    /**
     * @param  list<FlowNodeData>  $nodes
     * @param  list<FlowEdgeData>  $edges
     */
    private static function mermaid(array $nodes, array $edges): string
    {
        $lines = ['flowchart TD'];

        foreach ($nodes as $node) {
            $lines[] = '    '.self::mermaidId($node->id).'["'.self::mermaidText($node->label).'"]';
        }

        foreach ($edges as $edge) {
            $port = self::mermaidText($edge->port);
            $lines[] = '    '.self::mermaidId($edge->from)." -->|{$port}| ".self::mermaidId($edge->to);
        }

        return implode("\n", $lines);
    }

    /**
     * A label Mermaid shows as text and never reads as diagram markup.
     */
    private static function mermaidText(string $text): string
    {
        return strtr($text, self::MERMAID_ESCAPES);
    }

    private static function mermaidId(string $id): string
    {
        return (string) preg_replace('/[^A-Za-z0-9_]/', '_', $id);
    }
}
