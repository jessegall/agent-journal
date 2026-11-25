<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PhpParser\Node;
use PhpParser\Node\ComplexType;
use PhpParser\Node\Expr;
use PhpParser\Node\Expr\FuncCall;
use PhpParser\Node\Expr\Instanceof_;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\New_;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\FunctionLike;
use PhpParser\Node\Identifier;
use PhpParser\Node\IntersectionType;
use PhpParser\Node\Name;
use PhpParser\Node\NullableType;
use PhpParser\Node\Param;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Property;
use PhpParser\Node\UnionType;
use PHPStan\Analyser\Scope;
use PHPStan\Reflection\ReflectionProvider;
use PHPStan\Rules\IdentifierRuleError;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * Native PHP reflection is used only inside the wrapper's own implementation files (WRAPPER_FILES): everywhere else
 * a native reflector constructed, called statically, tested with instanceof, named in a type, or called through a
 * receiver whose type is or may be one is reported with the wrapper method to use instead. Inside those files a
 * public signature naming a native reflector is reported, so native handles never leave the wrapper.
 *
 * @implements Rule<Node>
 */
final class RawReflectionRule implements Rule
{
    /**
     * The files that implement the wrapper on native reflection, relative to the project root.
     */
    public const array WRAPPER_FILES = [
        'app/Enums/Engine/AttributeMatch.php',
        'app/Support/AttributeEntry.php',
        'app/Support/DeclarationAttributes.php',
        'app/Support/DeclaredType.php',
        'app/Support/ReflectedEnumCase.php',
        'app/Support/ReflectedMethod.php',
        'app/Support/ReflectedParameter.php',
        'app/Support/ReflectedProperty.php',
        'app/Support/ReflectionCatalogue.php',
        'app/Support/SourceNodeAttributes.php',
        'app/Support/Reflector.php',
    ];

    /**
     * PHP's own reflection classes and interfaces, lowercase.
     */
    private const array NATIVE_REFLECTORS = [
        'reflection',
        'reflectionattribute',
        'reflectionclass',
        'reflectionclassconstant',
        'reflectionconstant',
        'reflectionenum',
        'reflectionenumbackedcase',
        'reflectionenumunitcase',
        'reflectionextension',
        'reflectionfiber',
        'reflectionfunction',
        'reflectionfunctionabstract',
        'reflectiongenerator',
        'reflectionintersectiontype',
        'reflectionmethod',
        'reflectionnamedtype',
        'reflectionobject',
        'reflectionparameter',
        'reflectionproperty',
        'reflectionreference',
        'reflectiontype',
        'reflectionuniontype',
        'reflectionzendextension',
        'reflector',
    ];

    /**
     * Method names only native reflectors answer in this project; called on a receiver that may or may not be an
     * object of a known class, they need an explicit type before the check can decide.
     */
    private const array REFLECTION_METHODS = [
        'getattributes',
        'getbackingtype',
        'getcases',
        'getconstructor',
        'getdeclaringclass',
        'getdoccomment',
        'getinterfacenames',
        'getmethods',
        'getparentclass',
        'getproperties',
        'getreturntype',
        'gettraitnames',
        'implementsinterface',
        'issubclassof',
        'newinstanceargs',
        'newinstancewithoutconstructor',
        'newlazyghost',
        'newlazyproxy',
    ];

    /**
     * The wrapper call to use instead of a native method, by lowercase method name.
     */
    private const array WRAPPER_METHODS = [
        'getattributes' => 'Reflector::attributes(X::class), attribute(X::class) or hasAttribute(X::class)',
        'newinstance' => 'Reflector::attribute(X::class), which builds the attribute',
    ];

    /**
     * The TypeScript transformer's source nodes, which read attributes from native or source reflection.
     */
    private const array SOURCE_NODES = [
        'spatie\\typescripttransformer\\phpnodes\\phpclassnode',
        'spatie\\typescripttransformer\\phpnodes\\phppropertynode',
    ];

    /**
     * PHP's functions that ask about a type by its name, each with the Reflector question that answers it.
     */
    private const array TYPE_FUNCTIONS = [
        'class_exists' => 'Reflector::exists($name) and Reflector::of($name)->isClass()',
        'class_implements' => 'Reflector::of($target)->interfaces()',
        'class_uses' => 'Reflector::of($target)->traits() or ->uses(X::class)',
        'enum_exists' => 'Reflector::exists($name) and Reflector::of($name)->isEnum()',
        'get_parent_class' => 'Reflector::of($target)->parent()',
        'interface_exists' => 'Reflector::exists($name) and Reflector::of($name)->isInterface()',
        'is_a' => 'Reflector::of($target)->is(X::class), or ->isInstance($value)',
        'is_subclass_of' => 'Reflector::of($target)->isSubclassOf(X::class) or ->implements(X::class)',
        'method_exists' => 'Reflector::of($target)->hasMethod($name)',
        'property_exists' => 'Reflector::of($target)->hasProperty($name)',
        'trait_exists' => 'Reflector::exists($name) and Reflector::of($name)->isTrait()',
    ];

    private const string CONSTRUCTION_HINT = 'Reflector::of($target), or reflect() of the Reflects trait';

    private const string METHOD_HINT = 'the Reflector answer for it; add that answer to the wrapper when it has '
        .'none';

    private readonly string $root;

    /**
     * @param  list<string>  $wrapperFiles  the files allowed to use native reflection, relative to the project root
     */
    public function __construct(
        private readonly ReflectionProvider $reflectionProvider,
        private readonly array $wrapperFiles = self::WRAPPER_FILES,
    ) {
        $this->root = dirname(__DIR__, 3).'/';
    }

    public function getNodeType(): string
    {
        return Node::class;
    }

    /**
     * @return list<IdentifierRuleError>
     */
    public function processNode(Node $node, Scope $scope): array
    {
        if (in_array($this->relativePath($scope->getFile()), $this->wrapperFiles, true)) {
            return $this->publicSignatureErrors($node, $scope);
        }

        return match (true) {
            $node instanceof New_ => $this->constructionErrors($node, $scope),
            $node instanceof StaticCall => $this->staticCallErrors($node, $scope),
            $node instanceof FuncCall => $this->typeFunctionErrors($node, $scope),
            $node instanceof Instanceof_ => $this->instanceofErrors($node, $scope),
            // PHPStan hands a nullsafe call to rules as a MethodCall as well
            $node instanceof MethodCall => $this->methodCallErrors($node, $scope),
            $node instanceof Param => $this->typeErrors($node->type, $node, $scope),
            $node instanceof FunctionLike => $this->typeErrors($node->getReturnType(), $node, $scope),
            $node instanceof Property => $this->typeErrors($node->type, $node, $scope),
            $node instanceof Class_ => $this->extensionErrors($node, $scope),
            default => [],
        };
    }

    /**
     * @return list<IdentifierRuleError>
     */
    private function constructionErrors(New_ $node, Scope $scope): array
    {
        $names = $node->class instanceof Expr
            ? $this->classNamesOf($node->class, $scope)
            : $this->resolvedNames($node->class, $scope);

        return array_map(
            fn (string $name) => $this->error("new {$name}", self::CONSTRUCTION_HINT, $node, $scope),
            $this->nativeReflectorsAmong($names),
        );
    }

    /**
     * @return list<IdentifierRuleError>
     */
    private function staticCallErrors(StaticCall $node, Scope $scope): array
    {
        if (! $node->class instanceof Name || ! $node->name instanceof Identifier) {
            return [];
        }

        return array_map(
            fn (string $name) => $this->error(
                "{$name}::{$node->name->toString()}()",
                self::CONSTRUCTION_HINT,
                $node,
                $scope,
            ),
            $this->nativeReflectorsAmong([$scope->resolveName($node->class)]),
        );
    }

    /**
     * @return list<IdentifierRuleError>
     */
    private function instanceofErrors(Instanceof_ $node, Scope $scope): array
    {
        if ($node->class instanceof Expr && $scope->getType($node->class)->isString()->yes()) {
            return [$this->error(
                'instanceof on a type held as a name',
                'Reflector::of($type)->isInstance($value)',
                $node,
                $scope,
            )];
        }

        $names = $node->class instanceof Name ? [$scope->resolveName($node->class)] : [];

        return array_map(
            fn (string $name) => $this->error("instanceof {$name}", self::CONSTRUCTION_HINT, $node, $scope),
            $this->nativeReflectorsAmong($names),
        );
    }

    /**
     * @return list<IdentifierRuleError>
     */
    private function methodCallErrors(MethodCall $node, Scope $scope): array
    {
        if (! $node->name instanceof Identifier) {
            return [];
        }

        $method = $node->name->toString();
        $receiver = $scope->getType($node->var);
        $natives = $this->nativeReflectorsAmong($receiver->getObjectClassNames());

        if ($natives !== []) {
            $hint = self::WRAPPER_METHODS[strtolower($method)] ?? self::METHOD_HINT;

            return [$this->error(implode('|', $natives)."::{$method}()", $hint, $node, $scope)];
        }

        $sourceNodes = array_values(array_filter(
            $receiver->getObjectClassNames(),
            fn (string $name) => in_array(strtolower($name), self::SOURCE_NODES, true),
        ));

        if ($sourceNodes !== [] && strtolower($method) === 'getattributes') {
            return [$this->error(
                implode('|', $sourceNodes).'::getAttributes()',
                'SourceNodeAttributes::current()->carries($node, X::class)',
                $node,
                $scope,
            )];
        }

        if ($receiver->isObject()->maybe() && in_array(strtolower($method), self::REFLECTION_METHODS, true)) {
            return [$this->error(
                "{$method}() on a receiver of unknown type",
                'an explicit type for the receiver, so the reflection check can decide',
                $node,
                $scope,
            )];
        }

        return [];
    }

    /**
     * @return list<IdentifierRuleError>
     */
    private function typeErrors(Identifier|Name|ComplexType|null $type, Node $node, Scope $scope): array
    {
        return array_map(
            fn (string $name) => $this->error("{$name} type", 'a Reflector or the answer it gives', $node, $scope),
            $this->nativeReflectorsAmong($this->namesInType($type, $scope)),
        );
    }

    /**
     * @return list<IdentifierRuleError>
     */
    private function extensionErrors(Class_ $node, Scope $scope): array
    {
        $names = array_values(array_map(
            fn (Name $name) => $scope->resolveName($name),
            [...($node->extends === null ? [] : [$node->extends]), ...$node->implements],
        ));

        return array_map(
            fn (string $name) => $this->error("a class extending {$name}", self::CONSTRUCTION_HINT, $node, $scope),
            $this->nativeReflectorsAmong($names),
        );
    }

    /**
     * A call of one of PHP's functions that ask about a type by its name.
     *
     * @return list<IdentifierRuleError>
     */
    private function typeFunctionErrors(FuncCall $node, Scope $scope): array
    {
        if (! $node->name instanceof Name) {
            return [];
        }

        $function = strtolower(ltrim($node->name->toString(), '\\'));

        if (! isset(self::TYPE_FUNCTIONS[$function])) {
            return [];
        }

        return [$this->error("{$function}()", self::TYPE_FUNCTIONS[$function], $node, $scope)];
    }

    /**
     * Inside a wrapper file: a public method or property whose native type names a native reflector. A constructor
     * may take one, since it brings a native handle in and hands none out.
     *
     * @return list<IdentifierRuleError>
     */
    private function publicSignatureErrors(Node $node, Scope $scope): array
    {
        $types = match (true) {
            $node instanceof ClassMethod && $node->isPublic() && $node->name->toLowerString() === '__construct' => [],
            $node instanceof ClassMethod && $node->isPublic() => [
                $node->getReturnType(),
                ...array_map(fn (Param $parameter) => $parameter->type, $node->getParams()),
            ],
            $node instanceof Property && $node->isPublic() => [$node->type],
            default => [],
        };

        $names = array_merge(...array_map(fn ($type) => $this->namesInType($type, $scope), $types));

        return array_map(
            fn (string $name) => $this->error(
                "{$name} in a public signature",
                'a private native handle and a public answer that names no native reflector',
                $node,
                $scope,
            ),
            $this->nativeReflectorsAmong($names),
        );
    }

    /**
     * The class names an expression may hold as a class-string or an object.
     *
     * @return list<string>
     */
    private function classNamesOf(Expr $expression, Scope $scope): array
    {
        $type = $scope->getType($expression);

        return [
            ...array_map(fn ($string) => $string->getValue(), $type->getConstantStrings()),
            ...$type->getClassStringObjectType()->getObjectClassNames(),
            ...$type->getObjectClassNames(),
        ];
    }

    /**
     * @return list<string>
     */
    private function resolvedNames(Node $class, Scope $scope): array
    {
        return $class instanceof Name ? [$scope->resolveName($class)] : [];
    }

    /**
     * @return list<string>
     */
    private function namesInType(Identifier|Name|ComplexType|null $type, Scope $scope): array
    {
        return match (true) {
            $type instanceof Name => [$scope->resolveName($type)],
            $type instanceof NullableType => $this->namesInType($type->type, $scope),
            $type instanceof UnionType, $type instanceof IntersectionType => array_merge(
                ...array_map(fn ($member) => $this->namesInType($member, $scope), $type->types),
            ),
            default => [],
        };
    }

    /**
     * The names, as PHP declares them, that are a native reflector or extend or implement one.
     *
     * @param  list<string>  $names
     * @return list<string>
     */
    private function nativeReflectorsAmong(array $names): array
    {
        $natives = [];

        foreach (array_unique($names) as $name) {
            if (! $this->reflectionProvider->hasClass($name)) {
                continue;
            }

            $class = $this->reflectionProvider->getClass($name);
            $lineage = [$class->getName(), ...$class->getParentClassesNames(), ...array_map(fn ($interface) => $interface->getName(), array_values($class->getInterfaces()))];

            if (array_any($lineage, fn (string $member) => in_array(strtolower($member), self::NATIVE_REFLECTORS, true))) {
                $natives[] = $class->getName();
            }
        }

        return array_values(array_unique($natives));
    }

    private function error(string $operation, string $hint, Node $node, Scope $scope): IdentifierRuleError
    {
        return RuleErrorBuilder::message("{$operation}\nUse {$hint}.")
            ->identifier('reflection.raw')
            ->line($node->getStartLine())
            ->metadata(['operation' => $operation, 'declaration' => $this->declarationOf($scope)])
            ->build();
    }

    /**
     * The class and member the node sits in, such as App\Support\DeclaredCommand::retention.
     */
    private function declarationOf(Scope $scope): string
    {
        $class = match (true) {
            $scope->isInTrait() => $scope->getTraitReflection()->getName(),
            $scope->isInClass() => $scope->getClassReflection()->getName(),
            default => '',
        };
        $function = $scope->getFunctionName() ?? '';

        return match (true) {
            $class !== '' && $function !== '' => "{$class}::{$function}",
            default => $class.$function,
        };
    }

    private function relativePath(string $file): string
    {
        return str_starts_with($file, $this->root) ? substr($file, strlen($this->root)) : $file;
    }
}
