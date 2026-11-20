<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Stmt\Use_;

/**
 * How a name is used, kept only as fine as the boundary rules decide on.
 */
enum NameType: string
{
    case Import = 'import';
    case Type = 'type';
    case StateEventParameter = 'state-event-parameter';
    case ClassName = 'class-name';
    case Construction = 'construction';
    case StaticAccess = 'static-access';
    case Function = 'function';
    case Constant = 'constant';
    case String = 'string';
    case Other = 'other';

    /**
     * A listener may name another domain's event only to hear it: as an import, a type or ::class.
     */
    public function canNameAnEventToHearIt(): bool
    {
        return match ($this) {
            self::Import, self::Type, self::ClassName, self::StateEventParameter => true,
            self::Construction, self::StaticAccess, self::Function, self::Constant, self::String, self::Other => false,
        };
    }

    /**
     * The type an import line gives its names: use function and use const import a function or a constant.
     */
    public static function forImportType(int $type): self
    {
        return match ($type) {
            Use_::TYPE_FUNCTION => self::Function,
            Use_::TYPE_CONSTANT => self::Constant,
            default => self::Import,
        };
    }
}
