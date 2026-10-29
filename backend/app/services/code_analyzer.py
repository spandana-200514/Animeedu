import ast
import re


def analyze_code(language: str, code: str):
    lang = (language or "Python").strip()
    source = code or ""
    lines = source.splitlines() or [""]
    errors = []
    suggestions = []
    line_explanations = []

    for i, line in enumerate(lines, start=1):
        stripped = line.strip()
        if not stripped:
            line_explanations.append({"line": i, "code": line, "explanation": "Empty line used for readability."})
            continue
        if stripped.startswith("#") or stripped.startswith("//"):
            line_explanations.append({"line": i, "code": line, "explanation": "Comment that documents intent."})
            continue
        if "def " in stripped or "function " in stripped:
            explanation = "Defines a reusable function."
        elif "class " in stripped:
            explanation = "Defines a class / object blueprint."
        elif "for " in stripped or "while " in stripped:
            explanation = "Loop that repeats a block of logic."
        elif "if " in stripped:
            explanation = "Conditional decision in the program."
        elif "return" in stripped:
            explanation = "Sends a result back to the caller."
        elif "print" in stripped or "console.log" in stripped:
            explanation = "Outputs information for the learner or debugger."
        else:
            explanation = "Statement that performs a calculation or action."
        line_explanations.append({"line": i, "code": line, "explanation": explanation})

    if lang.lower() == "python":
        try:
            tree = ast.parse(source)
            func_count = sum(isinstance(n, ast.FunctionDef) for n in ast.walk(tree))
            loop_count = sum(isinstance(n, (ast.For, ast.While)) for n in ast.walk(tree))
            complexity = "Low" if loop_count + func_count < 3 else "Medium" if loop_count < 6 else "High"
            explanation = (
                f"This Python program contains {func_count} function(s) and {loop_count} loop(s). "
                "It can be explained as input, processing, and output."
            )
        except SyntaxError as exc:
            errors.append(f"Python syntax error on line {exc.lineno}: {exc.msg}")
            complexity = "Unknown until syntax is fixed"
            explanation = "The analyzer found a syntax problem. Fix the marked line, then re-run analysis."
        if "eval(" in source or "exec(" in source:
            suggestions.append("Avoid eval/exec in learning projects; they are hard to debug and unsafe.")
        if len(lines) > 80:
            suggestions.append("Split long files into smaller functions for easier revision.")
    else:
        complexity = "Medium" if len(lines) > 40 else "Low"
        explanation = (
            f"This {lang} snippet is read top to bottom. Identify inputs, the main algorithm, and the output. "
            "Match braces/semicolons carefully and test with a small example."
        )
        if lang.lower() in {"c", "c++"} and "int main" not in source:
            suggestions.append("C/C++ programs usually need a main function as the entry point.")
        if lang.lower() == "java" and "class " not in source:
            suggestions.append("Java code is typically wrapped in a class with a main method.")
        if lang.lower() == "javascript" and "var " in source:
            suggestions.append("Prefer let/const instead of var for clearer scope.")

    if not source.strip():
        errors.append("No code was provided.")
        explanation = "Paste a program first, then analyze it."
        complexity = "N/A"

    improved = source.strip() or f"// Start with a small {lang} example and build up."
    if lang.lower() == "python" and source.strip() and "if __name__" not in source:
        improved = source.rstrip() + "\n\n# Tip: add a main guard when the file is used as a script.\n"

    suggestions = suggestions or ["Add comments, test with sample input, and rename variables clearly."]
    return {
        "language": lang,
        "explanation": explanation,
        "line_by_line": line_explanations[:80],
        "errors": errors,
        "suggestions": suggestions,
        "complexity": complexity,
        "improved_code": improved,
    }
