<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Attributes\RequiresTransactionListener;
use PhpParser\Node\Attribute;
use PhpParser\Node\InterpolatedStringPart;
use PhpParser\Node\Scalar\String_;
use PhpParser\NodeFinder;

/**
 * Every string, string part or heredoc of a file that names project code, such as 'App\Models\Messages\Message'.
 * The listener a write owner's RequiresTransactionListener names is a declaration that admits it, never a use of it.
 */
final class StringScan
{
    /**
     * @return list<NameUse>
     */
    public static function of(ParsedFile $file, ProjectRoots $roots): array
    {
        $uses = [];

        $finder = new NodeFinder();
        $strings = [
            ...$finder->findInstanceOf($file->statements, String_::class),
            ...$finder->findInstanceOf($file->statements, InterpolatedStringPart::class),
        ];

        $declared = self::declaredListenersIn($file, $finder);

        foreach ($strings as $string) {
            if (! $roots->startsWithProjectNamespace($string->value) || isset($declared[spl_object_id($string)])) {
                continue;
            }

            $uses[] = new NameUse(
                $file->path,
                $string->getStartLine(),
                ProjectRoots::withoutLeadingBackslash($string->value),
                NameType::String,
            );
        }

        return $uses;
    }

    /**
     * The strings that name a listener in a RequiresTransactionListener attribute, by object id.
     *
     * @return array<int, true>
     */
    private static function declaredListenersIn(ParsedFile $file, NodeFinder $finder): array
    {
        $declared = [];

        foreach ($finder->findInstanceOf($file->statements, Attribute::class) as $attribute) {
            if (ltrim($attribute->name->toString(), '\\') !== RequiresTransactionListener::class) {
                continue;
            }

            foreach ($finder->findInstanceOf($attribute->args, String_::class) as $string) {
                $declared[spl_object_id($string)] = true;
            }
        }

        return $declared;
    }
}
