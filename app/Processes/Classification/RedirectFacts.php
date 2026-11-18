<?php

declare(strict_types=1);

namespace App\Processes\Classification;

use App\Processes\Enums\CommandClass;
use App\Processes\Enums\RedirectType;
use App\Processes\Enums\UnresolvedType;
use App\Processes\Values\ClassFact;
use App\Processes\Values\HereDocument;
use App\Processes\Values\Redirect;
use App\Processes\Values\ShellNode;
use App\Processes\Values\SyntaxOrigin;
use App\Processes\Values\UnresolvedFact;

/**
 * What a node's redirects do by themselves (doc 21 revision 3, section 5): < reads its target, > >> >| write it, <>
 * does both, duplications and closes touch no file, /dev/null and the fixed descriptors are harmless, /dev/tcp and
 * /dev/udp reach the network, and any other special endpoint or a target known only at run time is unresolved.
 */
final readonly class RedirectFacts
{
    private const array HARMLESS_ENDPOINTS = ['/dev/null', '/dev/stdin', '/dev/stdout', '/dev/stderr', '-'];

    /**
     * @return list<ClassFact>
     */
    public function factsOf(ShellNode $node): array
    {
        return array_merge(...array_map(fn (Redirect $redirect) => $this->factsOfRedirect($node, $redirect), $node->redirects));
    }

    /**
     * @return list<UnresolvedFact>
     */
    public function unresolvedOf(ShellNode $node): array
    {
        $unresolved = [];
        foreach ($node->redirects as $redirect) {
            $endpoint = $this->endpoint($redirect);
            if ($endpoint === null && $this->touchesFiles($redirect)) {
                $unresolved[] = new UnresolvedFact(UnresolvedType::DynamicWord, $node->id, 'A redirect target is only known when the command runs.');
            } elseif ($endpoint !== null && $this->isUnknownDevice($endpoint)) {
                $unresolved[] = new UnresolvedFact(UnresolvedType::UnsupportedSyntax, $node->id, "The redirect endpoint {$endpoint} is a special file with unknown effects.");
            }
        }

        return $unresolved;
    }

    /**
     * @return list<ClassFact>
     */
    private function factsOfRedirect(ShellNode $node, Redirect $redirect): array
    {
        $endpoint = $this->endpoint($redirect);
        if ($endpoint === null || ! $this->touchesFiles($redirect) || $this->isHarmless($endpoint) || $this->isUnknownDevice($endpoint)) {
            return [];
        }
        if (str_starts_with($endpoint, '/dev/tcp/') || str_starts_with($endpoint, '/dev/udp/')) {
            return [new ClassFact(CommandClass::Network, $node->id, new SyntaxOrigin('redirect'), "The redirect to {$endpoint} opens a network connection.")];
        }

        return array_map(fn (CommandClass $class) => new ClassFact($class, $node->id, new SyntaxOrigin('redirect'), "The {$redirect->type->value} redirect uses {$endpoint}."), $this->classesOf($redirect->type));
    }

    /**
     * @return list<CommandClass>
     */
    private function classesOf(RedirectType $type): array
    {
        return match ($type) {
            RedirectType::Input => [CommandClass::Read],
            RedirectType::Output, RedirectType::Append, RedirectType::Clobber => [CommandClass::Write],
            RedirectType::ReadWrite => [CommandClass::Read, CommandClass::Write],
            RedirectType::DuplicateInput, RedirectType::DuplicateOutput, RedirectType::Close, RedirectType::HereDocument, RedirectType::HereString => [],
        };
    }

    /**
     * Whether the redirect names a file it reads or writes, as opposed to a descriptor or inline text.
     */
    private function touchesFiles(Redirect $redirect): bool
    {
        return $this->classesOf($redirect->type) !== [];
    }

    private function endpoint(Redirect $redirect): string|null
    {
        return $redirect->target instanceof HereDocument ? '' : $redirect->target->literal();
    }

    private function isHarmless(string $endpoint): bool
    {
        return in_array($endpoint, self::HARMLESS_ENDPOINTS, true) || preg_match('#^/dev/fd/[0-9]+$#', $endpoint) === 1;
    }

    private function isUnknownDevice(string $endpoint): bool
    {
        return str_starts_with($endpoint, '/dev/') && ! $this->isHarmless($endpoint) && ! str_starts_with($endpoint, '/dev/tcp/') && ! str_starts_with($endpoint, '/dev/udp/');
    }
}
